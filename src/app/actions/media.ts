"use server";

import { clientIdentifier, rateLimit } from "@/lib/rate-limit";
import { parseMediaUrl } from "@/lib/media/platforms";
import { isResolverConfigured, resolveMedia } from "@/lib/media/resolver";
import type { MediaPlatform, MediaResponse } from "@/lib/media/types";

/**
 * Resolves a public post URL into downloadable files.
 *
 * Ordering matters: cheap local checks run before anything that costs money or
 * touches the network, so malformed input and abuse never reach the resolver.
 */

/** Resolves per client per window. Each one is an upstream request we pay for. */
const RESOLVE_LIMIT = 20;
const RESOLVE_WINDOW_SECONDS = 60 * 10;

const VALID_PLATFORMS: MediaPlatform[] = ["instagram", "facebook"];

export async function resolveMediaAction(
  rawUrl: string,
  platform: MediaPlatform,
): Promise<MediaResponse> {
  // Never trust the platform argument — it arrives from the client.
  if (!VALID_PLATFORMS.includes(platform)) {
    return {
      ok: false,
      error: { code: "invalid_url", message: "Unsupported platform." },
    };
  }

  if (typeof rawUrl !== "string") {
    return {
      ok: false,
      error: { code: "invalid_url", message: "Paste a link to get started." },
    };
  }

  // 1. Local validation — free, and rejects most bad input.
  const parsed = parseMediaUrl(rawUrl, platform);
  if (!parsed.ok || !parsed.url) {
    return {
      ok: false,
      error: { code: "invalid_url", message: parsed.reason ?? "That link isn't valid." },
    };
  }

  // 2. Tell the user the tool is switched off before rate limiting them for it.
  if (!isResolverConfigured()) {
    return {
      ok: false,
      error: {
        code: "not_configured",
        message:
          "This downloader isn't switched on yet. It needs a resolver service configured by the site owner.",
      },
    };
  }

  // 3. Rate limit.
  const identifier = await clientIdentifier();
  const limit = await rateLimit(
    `media-resolve:${identifier}`,
    RESOLVE_LIMIT,
    RESOLVE_WINDOW_SECONDS,
  );
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfter / 60);
    return {
      ok: false,
      error: {
        code: "rate_limited",
        message: `You've used your ${RESOLVE_LIMIT} downloads for now. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
    };
  }

  // 4. Resolve.
  return resolveMedia(parsed.url, platform);
}

/** Lets the page render an honest "not available yet" state on the server. */
export async function isDownloaderAvailable(): Promise<boolean> {
  return isResolverConfigured();
}
