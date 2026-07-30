import { NextResponse, type NextRequest } from "next/server";

import { clientIdentifier, rateLimit } from "@/lib/rate-limit";

/**
 * Streams a resolved media file back to the browser as an attachment.
 *
 * Why this exists at all: Meta's CDN serves videos with CORS headers that stop
 * the browser fetching them from our origin, and a plain <a download> to a
 * cross-origin URL is ignored — the file opens in a tab instead of saving.
 * Proxying is the only way to give a real "Save" experience.
 *
 * SECURITY — this endpoint is the highest-risk surface on the site. Without a
 * host allowlist it is an open proxy: anyone could route arbitrary traffic
 * through the domain, laundering their requests behind our IP and reputation.
 * Everything below exists to prevent that.
 */

export const runtime = "nodejs";
/** Streaming a file is inherently per-request. */
export const dynamic = "force-dynamic";

/**
 * Registrable domains we will proxy from. A hostname matches only when it is
 * exactly one of these or a subdomain of one.
 *
 * Matching is done on label boundaries, not raw string suffixes. A naive
 * `host.endsWith("fbcdn.net")` also matches "evil-fbcdn.net", which anyone can
 * register — that would turn this endpoint into an open proxy for a domain of
 * the attacker's choosing.
 */
const ALLOWED_DOMAINS = [
  "cdninstagram.com",
  "fbcdn.net",
];

/**
 * The configured resolver may tunnel bytes through itself, so its own host has
 * to be allowed too — but only that exact host, read from the environment.
 */
function resolverHost(): string | null {
  const raw = process.env.MEDIA_RESOLVER_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedHost(hostname: string): boolean {
  // Strip a trailing dot ("fbcdn.net." is the same host to DNS) and any
  // surrounding brackets from an IPv6 literal.
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");

  if (!host) return false;

  const resolver = resolverHost();
  if (resolver && host === resolver) return true;

  return ALLOWED_DOMAINS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}

/** Reels are small; this ceiling stops a huge file exhausting the function. */
const MAX_BYTES = 200 * 1024 * 1024; // 200 MB
const FETCH_TIMEOUT_MS = 30_000;

/** Per-client download cap. Generous for humans, hostile to scripts. */
const DOWNLOAD_LIMIT = 40;
const DOWNLOAD_WINDOW_SECONDS = 60 * 10;

/** Only ever serve these back; prevents the proxy returning HTML or scripts. */
const ALLOWED_CONTENT_PREFIXES = ["video/", "audio/", "image/"];

function sanitiseFilename(input: string | null): string {
  const fallback = `toolnagri-download-${Date.now()}.mp4`;
  if (!input) return fallback;

  // Keep only characters that are safe both as a filename and inside a quoted
  // Content-Disposition value. Anything outside this set (path separators,
  // quotes, CR/LF, control characters) becomes a hyphen, so the value can
  // neither traverse directories nor inject a second response header.
  const cleaned = input
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 120);

  return cleaned || fallback;
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("url");
  const requestedName = request.nextUrl.searchParams.get("filename");

  if (!target) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url parameter." }, { status: 400 });
  }

  if (parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only https sources are allowed." }, { status: 400 });
  }

  if (!isAllowedHost(parsed.hostname)) {
    // Deliberately terse: don't confirm to a prober which hosts are allowed.
    return NextResponse.json({ error: "That source is not allowed." }, { status: 403 });
  }

  const identifier = await clientIdentifier();
  const limit = await rateLimit(
    `media-download:${identifier}`,
    DOWNLOAD_LIMIT,
    DOWNLOAD_WINDOW_SECONDS,
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many downloads. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const upstream = await fetch(parsed.toString(), {
      signal: controller.signal,
      cache: "no-store",
      // Do not forward cookies or client headers upstream.
      headers: { Accept: "*/*" },
      redirect: "follow",
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: "Could not fetch that file. The link may have expired." },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    if (!ALLOWED_CONTENT_PREFIXES.some((p) => contentType.startsWith(p))) {
      return NextResponse.json(
        { error: "That link did not return a media file." },
        { status: 415 },
      );
    }

    const declaredLength = Number(upstream.headers.get("content-length") ?? 0);
    if (declaredLength && declaredLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "That file is too large to download through this tool." },
        { status: 413 },
      );
    }

    const filename = sanitiseFilename(requestedName);

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Never let a proxied third-party file be cached at the edge under our
      // origin, and never let it be sniffed into something executable.
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    });
    if (declaredLength) headers.set("Content-Length", String(declaredLength));

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      return NextResponse.json({ error: "The download timed out." }, { status: 504 });
    }
    console.error("media download proxy failed:", error);
    return NextResponse.json({ error: "Download failed. Please try again." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
