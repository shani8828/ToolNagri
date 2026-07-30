/** Shared types for the social media downloader tools. */

export type MediaPlatform = "instagram" | "facebook";

export type MediaKind = "video" | "audio" | "image";

export interface MediaVariant {
  /** What this file is. */
  kind: MediaKind;
  /** Direct URL to fetch. May be a CDN URL or a resolver tunnel URL. */
  url: string;
  /** Human label, e.g. "1080p MP4" or "Audio only (M4A)". */
  label: string;
  /** Suggested filename, without a path. */
  filename: string;
  /** Bytes, when the resolver reports it. */
  size?: number;
}

export interface MediaResult {
  platform: MediaPlatform;
  /** Poster/thumbnail URL, when available. */
  thumbnail?: string;
  /** Post caption or title, when available. */
  title?: string;
  /** Downloadable files, best quality first. */
  variants: MediaVariant[];
}

export type MediaError =
  /** The pasted text isn't a URL we recognise for this platform. */
  | { code: "invalid_url"; message: string }
  /** No resolver is configured — see MEDIA_RESOLVER_URL in the README. */
  | { code: "not_configured"; message: string }
  /** Caller is going too fast. */
  | { code: "rate_limited"; message: string }
  /** Post is private, deleted, age-restricted or otherwise not public. */
  | { code: "unavailable"; message: string }
  /** Resolver reachable but failed, or upstream blocked the request. */
  | { code: "resolver_failed"; message: string };

export type MediaResponse =
  | { ok: true; result: MediaResult }
  | { ok: false; error: MediaError };
