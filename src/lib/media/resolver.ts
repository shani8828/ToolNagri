import type { MediaPlatform, MediaResponse, MediaResult, MediaVariant } from "./types";

/**
 * Resolves a public post URL into downloadable file URLs.
 *
 * Why this is delegated rather than implemented here
 * --------------------------------------------------
 * Meta does not publish an API that returns media URLs for arbitrary public
 * posts. The only way to get them is to fetch and parse the page, which:
 *
 *   1. violates Meta's Terms of Service,
 *   2. is blocked in practice from datacenter IP ranges (Vercel included), and
 *   3. breaks every few weeks when the page structure changes.
 *
 * So resolution is delegated to an external service configured via
 * MEDIA_RESOLVER_URL. The wire format matches cobalt (github.com/imputnet/
 * cobalt), which is open-source and self-hostable — run your own instance on a
 * host with a residential or unblocked IP, or point at a commercial provider
 * that speaks the same shape.
 *
 * With no resolver configured the tools render and explain themselves rather
 * than failing silently.
 */

const RESOLVER_URL = process.env.MEDIA_RESOLVER_URL?.trim();
const RESOLVER_KEY = process.env.MEDIA_RESOLVER_API_KEY?.trim();

/** Upstream is a network hop we don't control; don't hang a serverless invocation on it. */
const RESOLVER_TIMEOUT_MS = 20_000;

export function isResolverConfigured(): boolean {
  return Boolean(RESOLVER_URL);
}

/* ────────────────────────── cobalt wire format ────────────────────────── */

interface CobaltPickerItem {
  type?: "video" | "photo" | "gif";
  url: string;
  thumb?: string;
}

interface CobaltResponse {
  status: "tunnel" | "redirect" | "picker" | "error" | "stream" | "success";
  url?: string;
  filename?: string;
  picker?: CobaltPickerItem[];
  audio?: string;
  audioFilename?: string;
  error?: { code?: string; context?: Record<string, unknown> };
  text?: string;
}

/** Maps upstream error codes onto messages that mean something to a visitor. */
function describeUpstreamError(code: string | undefined): MediaResponse {
  const c = (code ?? "").toLowerCase();

  if (c.includes("private") || c.includes("auth") || c.includes("login")) {
    return {
      ok: false,
      error: {
        code: "unavailable",
        message:
          "That post is private or requires a login, so it can't be fetched. Only public posts work.",
      },
    };
  }
  if (c.includes("not.found") || c.includes("notfound") || c.includes("empty")) {
    return {
      ok: false,
      error: {
        code: "unavailable",
        message: "That post couldn't be found. It may have been deleted or the link may be wrong.",
      },
    };
  }
  if (c.includes("unsupported") || c.includes("no.media")) {
    return {
      ok: false,
      error: {
        code: "unavailable",
        message: "No downloadable video was found at that link.",
      },
    };
  }
  if (c.includes("rate") || c.includes("limit")) {
    return {
      ok: false,
      error: {
        code: "rate_limited",
        message: "The download service is busy right now. Please try again in a moment.",
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "resolver_failed",
      message: "The download service couldn't process that link. Please try again shortly.",
    },
  };
}

function extensionFor(url: string, fallback: string): string {
  try {
    const path = new URL(url).pathname;
    const match = path.match(/\.([a-z0-9]{2,4})$/i);
    return match ? match[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
}

function safeFilename(platform: MediaPlatform, kind: string, ext: string): string {
  return `toolnagri-${platform}-${kind}-${Date.now()}.${ext}`;
}

function toVariants(data: CobaltResponse, platform: MediaPlatform): MediaVariant[] {
  const variants: MediaVariant[] = [];

  // Single-file responses: cobalt either proxies the bytes itself ("tunnel")
  // or hands back the upstream CDN URL ("redirect").
  if ((data.status === "tunnel" || data.status === "redirect") && data.url) {
    const ext = extensionFor(data.filename ?? data.url, "mp4");
    variants.push({
      kind: ext === "mp3" || ext === "m4a" || ext === "opus" ? "audio" : "video",
      url: data.url,
      label: ext === "mp3" || ext === "m4a" ? "Audio only" : "Video (best quality)",
      filename: data.filename ?? safeFilename(platform, "video", ext),
    });
  }

  // Carousels and multi-photo posts.
  if (data.status === "picker" && Array.isArray(data.picker)) {
    data.picker.forEach((item, i) => {
      if (!item?.url) return;
      const isPhoto = item.type === "photo";
      const ext = extensionFor(item.url, isPhoto ? "jpg" : "mp4");
      variants.push({
        kind: isPhoto ? "image" : "video",
        url: item.url,
        label: `${isPhoto ? "Photo" : "Video"} ${i + 1}`,
        filename: safeFilename(platform, isPhoto ? "photo" : "video", ext),
      });
    });

    if (data.audio) {
      variants.push({
        kind: "audio",
        url: data.audio,
        label: "Audio only",
        filename: data.audioFilename ?? safeFilename(platform, "audio", "mp3"),
      });
    }
  }

  return variants;
}

/**
 * Calls the configured resolver. Returns a discriminated result; never throws.
 */
export async function resolveMedia(
  url: string,
  platform: MediaPlatform,
): Promise<MediaResponse> {
  if (!RESOLVER_URL) {
    return {
      ok: false,
      error: {
        code: "not_configured",
        message:
          "The download service isn't configured yet. Set MEDIA_RESOLVER_URL to enable this tool.",
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESOLVER_TIMEOUT_MS);

  try {
    const response = await fetch(RESOLVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(RESOLVER_KEY ? { Authorization: `Api-Key ${RESOLVER_KEY}` } : {}),
      },
      body: JSON.stringify({
        url,
        videoQuality: "1080",
        downloadMode: "auto",
        filenameStyle: "basic",
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.status === 429) {
      return {
        ok: false,
        error: {
          code: "rate_limited",
          message: "The download service is rate limited right now. Please try again shortly.",
        },
      };
    }

    if (!response.ok && response.status >= 500) {
      return {
        ok: false,
        error: {
          code: "resolver_failed",
          message: "The download service is temporarily unavailable. Please try again shortly.",
        },
      };
    }

    const data = (await response.json()) as CobaltResponse;

    if (data.status === "error") {
      return describeUpstreamError(data.error?.code);
    }

    const variants = toVariants(data, platform);
    if (variants.length === 0) {
      return {
        ok: false,
        error: {
          code: "unavailable",
          message: "No downloadable media was found at that link.",
        },
      };
    }

    const result: MediaResult = {
      platform,
      variants,
      thumbnail: data.picker?.find((p) => p.thumb)?.thumb,
    };

    return { ok: true, result };
  } catch (error) {
    // Log detail server-side; return something generic. Upstream errors can
    // contain the resolver's host, key material and internal paths.
    if ((error as Error)?.name === "AbortError") {
      console.error(`resolveMedia timed out after ${RESOLVER_TIMEOUT_MS}ms`);
      return {
        ok: false,
        error: {
          code: "resolver_failed",
          message: "The download service took too long to respond. Please try again.",
        },
      };
    }

    console.error("resolveMedia failed:", error);
    return {
      ok: false,
      error: {
        code: "resolver_failed",
        message: "Couldn't reach the download service. Please try again shortly.",
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
