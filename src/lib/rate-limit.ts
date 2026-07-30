import { headers } from "next/headers";

import clientPromise from "./mongodb";

/**
 * Fixed-window rate limiter backed by MongoDB.
 *
 * In-memory counters are useless here: Vercel runs many short-lived instances,
 * so each one would keep its own tally and the effective limit would be
 * "limit × instances". MongoDB is already a dependency, so the counter lives
 * there where every instance sees the same value.
 */

const COLLECTION = "rate_limits";

interface RateLimitDoc {
  _id: string;
  count: number;
  expiresAt: Date;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. Only meaningful when `allowed` is false. */
  retryAfter: number;
}

/**
 * Best-effort client identifier.
 *
 * `x-forwarded-for` is set by Vercel's edge and is the closest thing to a
 * client IP available here. It is spoofable in principle, so treat this as
 * abuse friction rather than authentication.
 */
export async function clientIdentifier(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

/**
 * Consumes one unit against `key`.
 *
 * Fails open: if the datastore is unreachable the request is allowed through
 * rather than taking the whole feature down. The failure mode of a broken
 * limiter should not be worse than the abuse it prevents.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = Math.floor(now / (windowSeconds * 1000));
  const id = `${key}:${windowStart}`;

  try {
    const client = await clientPromise;
    const collection = client.db("toolnagri").collection<RateLimitDoc>(COLLECTION);

    const expiresAt = new Date((windowStart + 1) * windowSeconds * 1000);

    const doc = await collection.findOneAndUpdate(
      { _id: id },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: "after" },
    );

    const count = doc?.count ?? 1;
    const retryAfter = Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000));

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfter,
    };
  } catch (error) {
    console.error("rateLimit failed; allowing request:", error);
    return { allowed: true, remaining: limit, retryAfter: 0 };
  }
}

/**
 * TTL index so expired counters are reaped automatically.
 * Safe to call repeatedly; MongoDB ignores an identical index.
 */
export async function ensureRateLimitIndexes(): Promise<void> {
  const client = await clientPromise;
  await client
    .db("toolnagri")
    .collection<RateLimitDoc>(COLLECTION)
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "ratelimit_ttl" });
}
