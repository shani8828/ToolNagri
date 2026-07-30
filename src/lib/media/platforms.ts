import type { MediaPlatform } from "./types";

/**
 * URL parsing and validation for each supported platform.
 *
 * Validation happens before any network call so that obviously-wrong input
 * (a YouTube link pasted into the Instagram tool, or a bare word) is rejected
 * instantly and locally, rather than burning a resolver request.
 */

export interface PlatformSpec {
  id: MediaPlatform;
  label: string;
  /** Hosts we accept, normalised without "www.". */
  hosts: string[];
  /** At least one must match the pathname for the URL to be accepted. */
  pathPatterns: RegExp[];
  /** Shown in the input placeholder. */
  example: string;
}

export const PLATFORMS: Record<MediaPlatform, PlatformSpec> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    hosts: ["instagram.com", "instagr.am", "ddinstagram.com"],
    pathPatterns: [
      /^\/reels?\/[A-Za-z0-9_-]+/, //   /reel/ABC  and  /reels/ABC
      /^\/p\/[A-Za-z0-9_-]+/, //        /p/ABC      (posts can hold video)
      /^\/tv\/[A-Za-z0-9_-]+/, //       /tv/ABC     (IGTV)
      /^\/share\/[A-Za-z0-9_/-]+/, //   share links redirect to the above
      /^\/[A-Za-z0-9_.]+\/reels?\/[A-Za-z0-9_-]+/, // /username/reel/ABC
      /^\/stories\/[A-Za-z0-9_.]+\/\d+/, //          /stories/user/12345
    ],
    example: "https://www.instagram.com/reel/Cxyz123AbCd/",
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    hosts: ["facebook.com", "fb.watch", "fb.com", "m.facebook.com", "web.facebook.com"],
    pathPatterns: [
      /^\/reel\/\d+/, //                        /reel/123456
      /^\/[A-Za-z0-9_.-]+\/videos\/\d+/, //     /page/videos/123456
      /^\/watch\/?/, //                         /watch/?v=123456
      /^\/video\.php/, //                       legacy /video.php?v=
      /^\/share\/[rv]\/[A-Za-z0-9_-]+/, //      /share/r/abc  and  /share/v/abc
      /^\/[A-Za-z0-9_-]+\/?$/, //               fb.watch short codes
      /^\/photo/, //                            occasionally wraps a video
      /^\/stories\/\d+/,
    ],
    example: "https://www.facebook.com/reel/1234567890123456",
  },
};

/** Strip "www." so host comparisons are stable. */
function normaliseHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export interface ParsedMediaUrl {
  ok: boolean;
  /** Cleaned URL to hand to the resolver — tracking params removed. */
  url?: string;
  reason?: string;
}

/**
 * Tracking parameters that leak the sharer's identity. Stripped before the
 * URL leaves our server so we don't forward them to a third-party resolver.
 */
const TRACKING_PARAMS = [
  "igsh",
  "igshid",
  "fbclid",
  "mibextid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "_nc_cat",
  "rdid",
  "share_url",
];

/**
 * Validates that `input` is a public post URL for `platform` and returns a
 * cleaned version. Never throws.
 */
export function parseMediaUrl(input: string, platform: MediaPlatform): ParsedMediaUrl {
  const spec = PLATFORMS[platform];
  const raw = input.trim();

  if (!raw) {
    return { ok: false, reason: `Paste a ${spec.label} link to get started.` };
  }

  if (raw.length > 2048) {
    return { ok: false, reason: "That URL is too long to be a valid post link." };
  }

  // Reject dangerous schemes outright rather than letting the https:// prefix
  // below disguise them.
  if (/^\s*(javascript|data|vbscript|file|blob|about):/i.test(raw)) {
    return { ok: false, reason: "That doesn't look like a valid link." };
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, reason: "Only http and https links are supported." };
  }

  const host = normaliseHost(parsed.hostname);
  if (!spec.hosts.includes(host)) {
    return {
      ok: false,
      reason: `That's not a ${spec.label} link. Expected a URL like ${spec.example}`,
    };
  }

  const pathMatches = spec.pathPatterns.some((re) => re.test(parsed.pathname));
  if (!pathMatches) {
    return {
      ok: false,
      reason: `That ${spec.label} link doesn't point at a video. Copy the link to a specific reel or video post.`,
    };
  }

  for (const param of TRACKING_PARAMS) parsed.searchParams.delete(param);
  parsed.hash = "";

  return { ok: true, url: parsed.toString() };
}

/** Best-effort platform guess, used to tell someone they're on the wrong page. */
export function detectPlatform(input: string): MediaPlatform | null {
  const raw = input.trim();
  if (!raw) return null;

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = normaliseHost(parsed.hostname);
  for (const spec of Object.values(PLATFORMS)) {
    if (spec.hosts.includes(host)) return spec.id;
  }
  return null;
}
