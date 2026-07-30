/**
 * Skeleton primitives.
 *
 * Deliberately NOT wired into a root `loading.tsx`. Nearly every route here is
 * statically prerendered, so there is no loading phase to fill — a root
 * loading boundary forced React to stream a Suspense placeholder and shipped
 * ~32 skeleton nodes inside every page's HTML, adding weight and a visible
 * flash before content that was already there.
 *
 * Use these for genuine waits instead: work a tool performs after interaction
 * (compressing an image, parsing a large PDF) or a route that queries a
 * database. Shimmer is CSS-only — see `.skeleton` in globals.css.
 */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

/** Several lines of placeholder text; the last is short, as real text is. */
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** Matches the footprint of ToolCard so grids don't shift when results land. */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border-color bg-card-bg p-5" aria-hidden>
      <div className="mb-3.5 flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-2.5 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="mt-4 h-3 w-20" />
    </div>
  );
}

/** Grid of placeholder cards, for tool listings awaiting data. */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading tools"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
