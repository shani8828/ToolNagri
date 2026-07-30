"use server";

import { randomInt } from "node:crypto";

import { rateLimit, clientIdentifier } from "@/lib/rate-limit";
import {
  SLUG_PATTERN,
  shortUrlCollection,
  type ShortUrlDoc,
} from "@/lib/shortlinks";
import { isReservedSlug, validateDestination } from "@/lib/url-safety";

/**
 * Public, unauthenticated endpoints - hardened accordingly.
 *
 * Previously this action accepted any string as a destination, used
 * Math.random() for slugs, and enforced uniqueness with a check-then-write
 * that races under concurrency. It also had no rate limit at all, which for a
 * link shortener is an open invitation to spammers.
 */

/** Links a single client may create per hour. */
const CREATE_LIMIT = 12;
const CREATE_WINDOW_SECONDS = 60 * 60;

/** Analytics reads are cheap but shouldn't be an unbounded scan vector. */
const READ_LIMIT = 60;
const READ_WINDOW_SECONDS = 60;

const SLUG_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_CUSTOM_SLUG = 48;
const MAX_ANALYTICS_SLUGS = 100;

/** Cryptographically random slug - Math.random() is predictable and guessable. */
function generateSlug(length = 7): string {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[randomInt(SLUG_ALPHABET.length)];
  }
  return slug;
}

function expiryDate(option?: string): Date | null {
  const hours: Record<string, number> = { "1h": 1, "1d": 24, "1w": 24 * 7 };
  const h = option ? hours[option] : undefined;
  return h ? new Date(Date.now() + h * 60 * 60 * 1000) : null;
}

/** Duplicate-key error from the unique index on `slug`. */
function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
}

export interface CreateShortUrlResult {
  success: boolean;
  slug?: string;
  originalUrl?: string;
  expiresAt?: string | null;
  error?: string;
}

export async function createShortUrlAction(
  originalUrl: string,
  customSlug?: string,
  expiryOption?: string,
): Promise<CreateShortUrlResult> {
  // 1. Rate limit before doing any work.
  const identifier = await clientIdentifier();
  const limit = await rateLimit(`shorten:${identifier}`, CREATE_LIMIT, CREATE_WINDOW_SECONDS);
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfter / 60);
    return {
      success: false,
      error: `You've created the maximum of ${CREATE_LIMIT} links this hour. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  // 2. Validate the destination.
  const check = validateDestination(originalUrl);
  if (!check.ok) return { success: false, error: check.reason };

  // 3. Validate a custom slug if one was supplied.
  let requestedSlug: string | null = null;
  if (customSlug && customSlug.trim()) {
    const candidate = customSlug.trim();

    if (candidate.length > MAX_CUSTOM_SLUG) {
      return { success: false, error: `Custom slugs must be ${MAX_CUSTOM_SLUG} characters or fewer.` };
    }
    if (!SLUG_PATTERN.test(candidate)) {
      return {
        success: false,
        error: "Custom slugs may use letters, numbers, hyphens and underscores (3–48 characters).",
      };
    }
    if (isReservedSlug(candidate)) {
      return {
        success: false,
        error: "That name is used by a page on this site. Please choose another.",
      };
    }
    requestedSlug = candidate;
  }

  const expiresAt = expiryDate(expiryOption);

  try {
    const collection = await shortUrlCollection();

    // 4. Insert, relying on the unique index rather than a check-then-write.
    //    A prior existence check is racy: two concurrent requests can both see
    //    "free" and both insert. Let the database arbitrate.
    if (requestedSlug) {
      // An expired document still occupies the slug until the TTL sweep runs,
      // so clear it first to keep custom names reusable.
      await collection.deleteOne({ slug: requestedSlug, expiresAt: { $lt: new Date() } });

      const doc: ShortUrlDoc = {
        slug: requestedSlug,
        originalUrl: check.url,
        createdAt: new Date(),
        expiresAt,
        clicks: 0,
      };

      try {
        await collection.insertOne(doc);
      } catch (error) {
        if (isDuplicateKeyError(error)) {
          return { success: false, error: "That custom name is already taken." };
        }
        throw error;
      }

      return {
        success: true,
        slug: requestedSlug,
        originalUrl: check.url,
        expiresAt: expiresAt?.toISOString() ?? null,
      };
    }

    // 5. Random slug - retry on the astronomically unlikely collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = generateSlug();
      try {
        await collection.insertOne({
          slug,
          originalUrl: check.url,
          createdAt: new Date(),
          expiresAt,
          clicks: 0,
        });
        return {
          success: true,
          slug,
          originalUrl: check.url,
          expiresAt: expiresAt?.toISOString() ?? null,
        };
      } catch (error) {
        if (!isDuplicateKeyError(error)) throw error;
      }
    }

    return { success: false, error: "Couldn't allocate a unique short link. Please try again." };
  } catch (error) {
    // Log the detail; return something generic. Driver errors can leak the
    // connection string, collection names and server topology.
    console.error("createShortUrlAction failed:", error);
    return { success: false, error: "Something went wrong creating that link. Please try again." };
  }
}

export interface AnalyticsRow {
  slug: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clicks: number;
}

export async function getShortUrlsAnalyticsAction(
  slugs: string[],
): Promise<{ success: boolean; data?: AnalyticsRow[]; error?: string }> {
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return { success: true, data: [] };
  }

  const identifier = await clientIdentifier();
  const limit = await rateLimit(`analytics:${identifier}`, READ_LIMIT, READ_WINDOW_SECONDS);
  if (!limit.allowed) {
    return { success: false, error: "Too many requests. Please wait a moment." };
  }

  // Bound the query and drop anything that isn't slug-shaped, so a crafted
  // payload can't turn one call into a huge scan.
  const safeSlugs = slugs
    .filter((s): s is string => typeof s === "string" && SLUG_PATTERN.test(s))
    .slice(0, MAX_ANALYTICS_SLUGS);

  if (safeSlugs.length === 0) return { success: true, data: [] };

  try {
    const collection = await shortUrlCollection();
    const docs = await collection
      .find({ slug: { $in: safeSlugs } })
      .project<ShortUrlDoc>({ _id: 0 })
      .toArray();

    return {
      success: true,
      data: docs.map((doc) => ({
        slug: doc.slug,
        originalUrl: doc.originalUrl,
        createdAt: new Date(doc.createdAt).toISOString(),
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : null,
        clicks: doc.clicks ?? 0,
      })),
    };
  } catch (error) {
    console.error("getShortUrlsAnalyticsAction failed:", error);
    return { success: false, error: "Couldn't load analytics. Please try again." };
  }
}
