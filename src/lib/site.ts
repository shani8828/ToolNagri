/**
 * Single source of truth for site-wide constants.
 *
 * SITE_URL drives canonical tags, OG urls, the sitemap and JSON-LD, so getting
 * it wrong is expensive: a production build that emits
 * `<link rel="canonical" href="http://localhost:3000/…">` deindexes the site
 * more thoroughly than having no canonical at all.
 *
 * Because this module is imported by client components too, the value has to
 * resolve identically on server and client. It therefore depends only on
 * build-time-inlined values (NEXT_PUBLIC_* and NODE_ENV) - never on
 * request-time or server-only variables, which would cause a hydration
 * mismatch between prerendered HTML and the browser.
 */

import { TOOLS } from "./tools";

/** Fallback used whenever the environment doesn't supply a usable value. */
const PRODUCTION_URL = "https://toolnagri.vercel.app";

/** Single place the "N tools" figure comes from. */
export const TOOL_COUNT = TOOLS.length;

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (!configured) return PRODUCTION_URL;

  // A local address is correct in development and catastrophic in production.
  // Guard rather than trust, since the same .env is easy to copy to Vercel.
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(
    configured,
  );

  if (isLocal && process.env.NODE_ENV === "production") {
    return PRODUCTION_URL;
  }

  return configured;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "ToolNagri";

export const SITE_TAGLINE = "Free Online Tools";

/**
 * Derived from the catalogue so the number in the meta description can't drift
 * out of date when tools are added. `tools.ts` imports only types from its
 * siblings, so there's no cycle here.
 */
export const SITE_DESCRIPTION =
  `${TOOL_COUNT} free online tools — download Instagram and Facebook reels, compress images, ` +
  `merge PDFs, format JSON and generate QR codes. No signup, no limits.`;

export const SITE_LOCALE = "en_IN";

export const ORG_NAME = "Ayodhya Serenity";
export const ORG_URL = "https://ayodhyaserenity.vercel.app";
export const CONTACT_EMAIL = "info.ayodhyaserenity@gmail.com";

/** Absolute URL helper. Pass a root-relative path ("/qr-generator"). */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
