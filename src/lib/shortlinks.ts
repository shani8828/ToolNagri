import clientPromise from "./mongodb";

export interface ShortUrlDoc {
  slug: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt: Date | null;
  clicks: number;
}

export const SHORTLINK_DB = "toolnagri";
export const SHORTLINK_COLLECTION = "short_urls";

/** Slug shape accepted by the shortener. Also used to reject junk cheaply. */
export const SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,48}$/;

/**
 * Index creation runs once per server instance, not once per request.
 * Memoised as a promise so concurrent callers share the same attempt.
 */
let indexesReady: Promise<void> | null = null;

/** Raw handle with no index bootstrapping — used by the bootstrapper itself. */
async function rawCollection() {
  const client = await clientPromise;
  return client.db(SHORTLINK_DB).collection<ShortUrlDoc>(SHORTLINK_COLLECTION);
}

export async function shortUrlCollection() {
  const collection = await rawCollection();

  indexesReady ??= ensureShortlinkIndexes().catch((error) => {
    // Don't cache a failure — let the next caller retry.
    indexesReady = null;
    console.error("Failed to create shortlink indexes:", error);
  });
  await indexesReady;

  return collection;
}

export type ResolveResult =
  | { status: "found"; url: string }
  | { status: "missing" }
  | { status: "expired" }
  | { status: "error" };

/**
 * Resolves a short slug to its destination and records the click.
 *
 * Returns a discriminated result rather than throwing or redirecting so the
 * caller decides the HTTP semantics. The previous implementation redirected
 * misses to `/?error=not-found`, which meant every unknown URL on the domain
 * answered 307 → 200 instead of 404 — an unbounded supply of soft 404s.
 */
export async function resolveShortLink(slug: string): Promise<ResolveResult> {
  // Reject anything that cannot be a slug before touching the database, so a
  // crawler walking made-up URLs can't turn into a stream of queries.
  if (!SLUG_PATTERN.test(slug)) return { status: "missing" };

  try {
    const collection = await shortUrlCollection();
    const doc = await collection.findOne({ slug });

    if (!doc) return { status: "missing" };

    if (doc.expiresAt && new Date(doc.expiresAt) < new Date()) {
      await collection.deleteOne({ slug });
      return { status: "expired" };
    }

    // Fire-and-forget: a failed counter update must not block the redirect.
    void collection.updateOne({ slug }, { $inc: { clicks: 1 } }).catch(() => {});

    return { status: "found", url: doc.originalUrl };
  } catch (error) {
    console.error(`resolveShortLink(${slug}) failed:`, error);
    return { status: "error" };
  }
}

/**
 * Creates the indexes the shortener relies on. Safe to call repeatedly.
 * Slug uniqueness is enforced by the database, not just by the check-then-write
 * in the server action, which is racy under concurrent requests.
 */
export async function ensureShortlinkIndexes(): Promise<void> {
  const collection = await rawCollection();
  await collection.createIndex({ slug: 1 }, { unique: true, name: "slug_unique" });
  // TTL index: MongoDB removes expired links on its own.
  await collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, name: "expires_ttl" },
  );
}
