"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

/**
 * Route-level error boundary. Keeps a crashing tool from taking down the whole
 * shell and gives the visitor a way out.
 *
 * The raw error message is deliberately not rendered - it can contain internal
 * paths or values from whatever the user was processing. The digest is a safe
 * identifier that correlates with the server log.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border-color bg-secondary-bg text-warning">
        <TriangleAlert aria-hidden className="h-5 w-5" />
      </span>

      <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-primary-text">
        Something went wrong
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-secondary-text">
        This tool hit an unexpected error. Your files were being processed in your browser, so
        nothing was uploaded or lost - reloading usually clears it.
      </p>

      {error.digest && (
        <p className="mt-4 text-[12px] text-secondary-text">
          Reference:{" "}
          <code className="rounded bg-secondary-bg px-1.5 py-0.5 font-mono">{error.digest}</code>
        </p>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-background transition-colors hover:bg-accent-light"
        >
          Try again
        </button>
        <Link
          href="/all-tools"
          className="rounded-xl border border-border-color bg-card-bg px-5 py-3 text-[14px] font-semibold text-primary-text transition-colors hover:bg-hover-bg"
        >
          Browse all tools
        </Link>
      </div>
    </div>
  );
}
