import { CATEGORIES } from "./categories";
import { TOOLS } from "./tools";
import { SITE_URL } from "./site";

/**
 * Validation for user-submitted short-link destinations.
 *
 * A public, unauthenticated shortener is an attractive target: once a domain
 * is used to cloak phishing, Google Safe Browsing flags it and every ranking
 * on the site goes with it. These checks are the cheap half of the defence;
 * rate limiting in `rate-limit.ts` is the other half.
 */

export const MAX_URL_LENGTH = 2048;

/** Only ever redirect to real web pages. */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Hostnames that must never be redirect targets.
 *
 * We don't fetch these URLs server-side, so this isn't classic SSRF - but a
 * short link pointing at 127.0.0.1 or a cloud metadata address aims the
 * *visitor's* browser at their own network, which is not something this site
 * should lend its domain to.
 */
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (host === "::1" || host === "0.0.0.0") return true;

  // Cloud instance metadata.
  if (host === "169.254.169.254" || host === "metadata.google.internal") return true;

  // IPv4 private and loopback ranges.
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 10 || a === 127) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
  }

  // IPv6 unique-local and link-local.
  if (/^f[cd][0-9a-f]{2}:/i.test(host) || /^fe80:/i.test(host)) return true;

  return false;
}

export type UrlCheck = { ok: true; url: string } | { ok: false; reason: string };

export function validateDestination(input: string): UrlCheck {
  const raw = input.trim();

  if (!raw) return { ok: false, reason: "Enter a URL to shorten." };
  if (raw.length > MAX_URL_LENGTH) {
    return { ok: false, reason: `URLs must be under ${MAX_URL_LENGTH} characters.` };
  }

  // Reject dangerous schemes before the protocol-less prefixing below could
  // disguise them (e.g. "javascript:alert(1)" must not become a valid link).
  if (/^\s*(javascript|data|vbscript|file|blob|about):/i.test(raw)) {
    return { ok: false, reason: "That link type isn't allowed." };
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL." };
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return { ok: false, reason: "Only http and https links can be shortened." };
  }

  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    return { ok: false, reason: "Enter a full domain, for example example.com/page." };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, reason: "URLs containing login credentials aren't allowed." };
  }

  if (isBlockedHost(parsed.hostname)) {
    return { ok: false, reason: "Links to local or private addresses aren't allowed." };
  }

  // Don't let the shortener point at itself - that's how redirect loops and
  // chained-redirect cloaking get built.
  try {
    if (parsed.hostname === new URL(SITE_URL).hostname) {
      return { ok: false, reason: "You can't shorten a link back to this site." };
    }
  } catch {
    /* SITE_URL is always valid; ignore. */
  }

  return { ok: true, url: parsed.toString() };
}

/**
 * Slugs that would shadow a real route.
 *
 * Derived from the catalogue rather than hand-listed. The previous hard-coded
 * array named 12 slugs while 42 tools existed, so a user could claim
 * "pdf-merge" and get a link that silently never resolved - static routes win
 * in Next.js routing, so the redirect would never fire.
 */
const EXTRA_RESERVED = [
  "s",
  "api",
  "tools",
  "all-tools",
  "contact",
  "privacy",
  "terms",
  "disclaimer",
  "sitemap.xml",
  "sitemap",
  "robots.txt",
  "robots",
  "manifest.webmanifest",
  "manifest",
  "opengraph-image",
  "favicon.ico",
  "_next",
  "admin",
  "login",
  "signup",
  "dashboard",
  "static",
  "public",
  "assets",
];

export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  ...TOOLS.map((t) => t.slug),
  ...CATEGORIES.map((c) => c.slug),
  ...EXTRA_RESERVED,
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
