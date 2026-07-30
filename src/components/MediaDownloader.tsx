"use client";

import { useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  ClipboardPaste,
  Download,
  Film,
  Info,
  Music,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import { resolveMediaAction } from "@/app/actions/media";
import { detectPlatform, PLATFORMS } from "@/lib/media/platforms";
import type { MediaPlatform, MediaResult, MediaVariant } from "@/lib/media/types";
import { Skeleton } from "@/components/Skeleton";

interface Props {
  platform: MediaPlatform;
  /** False when MEDIA_RESOLVER_URL is unset — rendered from the server. */
  available: boolean;
}

export default function MediaDownloader({ platform, available }: Props) {
  const spec = PLATFORMS[platform];

  const [url, setUrl] = useState("");
  const [result, setResult] = useState<MediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  /** Warn early if someone pastes a link for the other platform. */
  function onUrlChange(value: string) {
    setUrl(value);
    setError(null);

    const detected = detectPlatform(value);
    if (detected && detected !== platform) {
      setNotice(
        `That looks like a ${PLATFORMS[detected].label} link. Use the ${PLATFORMS[detected].label} downloader for it.`,
      );
    } else {
      setNotice(null);
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onUrlChange(text);
        inputRef.current?.focus();
      }
    } catch {
      // Permission denied or unsupported — the user can still paste manually.
      setNotice("Couldn't read the clipboard. Paste the link with Ctrl+V instead.");
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await resolveMediaAction(url, platform);
      if (response.ok) {
        setResult(response.result);
      } else {
        setError(response.error.message);
      }
    });
  }

  function reset() {
    setUrl("");
    setResult(null);
    setError(null);
    setNotice(null);
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-6">
      {!available && (
        <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
          <TriangleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="text-[13px] leading-relaxed text-primary-text">
            <p className="font-semibold">This downloader isn&apos;t switched on yet.</p>
            <p className="mt-1 text-secondary-text">
              It needs a resolver service configured before it can fetch videos. Everything else on
              the page works — try one of the related tools below in the meantime.
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={onSubmit} className="space-y-3">
        <label htmlFor="media-url" className="block text-sm font-semibold text-primary-text">
          {spec.label} video link
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <input
              id="media-url"
              ref={inputRef}
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={spec.example}
              disabled={!available || pending}
              className="w-full rounded-lg border border-border-color bg-background px-4 py-3 pr-11 text-sm text-primary-text placeholder-secondary-text/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
            />
            <button
              type="button"
              onClick={pasteFromClipboard}
              disabled={!available || pending}
              aria-label="Paste from clipboard"
              title="Paste from clipboard"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text disabled:opacity-40"
            >
              <ClipboardPaste className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!available || pending || !url.trim()}
              className="flex-1 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {pending ? "Fetching…" : "Get video"}
            </button>
            {(result || error || url) && (
              <button
                type="button"
                onClick={reset}
                disabled={pending}
                aria-label="Clear"
                title="Clear"
                className="rounded-lg border border-border-color px-3 py-3 text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {notice && (
          <p className="flex items-start gap-1.5 text-[12.5px] text-secondary-text">
            <Info aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {notice}
          </p>
        )}
      </form>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-[13px] leading-relaxed"
        >
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <p className="text-primary-text">{error}</p>
        </div>
      )}

      {/* Loading — a genuine wait, so a skeleton earns its place here. */}
      {pending && (
        <div className="rounded-xl border border-border-color bg-secondary-bg/50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-40 w-full shrink-0 rounded-lg sm:h-28 sm:w-48" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-2/3 rounded-lg" />
            </div>
          </div>
          <p className="mt-4 text-center text-[12px] text-secondary-text">
            Fetching the video from {spec.label}…
          </p>
        </div>
      )}

      {/* Result */}
      {result && !pending && (
        <div className="animate-fade-up rounded-xl border border-border-color bg-secondary-bg/50 p-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            {result.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={result.thumbnail}
                alt=""
                loading="lazy"
                className="h-40 w-full shrink-0 rounded-lg border border-border-color bg-card-bg object-cover sm:h-28 sm:w-48"
              />
            )}

            <div className="min-w-0 flex-1">
              {result.title && (
                <p className="mb-3 line-clamp-2 text-[13px] font-medium text-primary-text">
                  {result.title}
                </p>
              )}
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-secondary-text">
                {result.variants.length} file{result.variants.length === 1 ? "" : "s"} ready
              </p>

              <ul className="space-y-2">
                {result.variants.map((variant, i) => (
                  <li key={`${variant.url}-${i}`}>
                    <DownloadButton variant={variant} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Rights notice. Shown always, not buried — it's the honest framing. */}
      <div className="flex gap-2.5 rounded-xl border border-border-color bg-card-bg p-4">
        <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-secondary-text" />
        <p className="text-[12.5px] leading-relaxed text-secondary-text">
          Download only content you own or have permission to save, and keep it to personal use.
          Reposting someone else&apos;s video without credit or a licence may infringe their
          copyright and can breach {spec.label}&apos;s terms. Private posts are never accessible.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────── download button ────────────────────────── */

const KIND_ICON = {
  video: Film,
  audio: Music,
  image: Download,
} as const;

function DownloadButton({ variant }: { variant: MediaVariant }) {
  const Icon = KIND_ICON[variant.kind];

  // Routed through our proxy: Meta's CDN blocks cross-origin reads and ignores
  // the download attribute, so a direct link opens a tab instead of saving.
  const href = `/api/media/download?url=${encodeURIComponent(variant.url)}&filename=${encodeURIComponent(variant.filename)}`;

  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-lg border border-border-color bg-card-bg px-4 py-2.5 transition-all duration-200 hover:border-secondary-text/30 hover:shadow-card"
    >
      <Icon aria-hidden className="h-4 w-4 shrink-0 text-secondary-text" />
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-primary-text">
        {variant.label}
      </span>
      {variant.size ? (
        <span className="shrink-0 text-[11px] text-secondary-text">
          {(variant.size / 1024 / 1024).toFixed(1)} MB
        </span>
      ) : null}
      <Download
        aria-hidden
        className="h-4 w-4 shrink-0 text-secondary-text transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-primary-text"
      />
    </a>
  );
}
