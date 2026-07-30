import Link from "next/link";

import { CATEGORIES } from "@/lib/categories";
import { POPULAR_TOOLS, toolsInCategory } from "@/lib/tools";

/**
 * Root 404. Next.js serves this for unmatched URLs and for any `notFound()`
 * call, with a real 404 status and an automatic noindex tag.
 *
 * It links onward to the category hubs and popular tools rather than dead-
 * ending, which keeps a mistyped URL useful to both visitors and crawlers.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="animate-fade-up text-center">
        <p className="font-heading text-[13px] font-bold uppercase tracking-widest text-secondary-text">
          404
        </p>
        <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-primary-text md:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-secondary-text">
          The address may be mistyped, or the page may have moved. If you followed a short link, it
          may have expired or never existed.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-background transition-colors hover:bg-accent-light"
          >
            Go to homepage
          </Link>
          <Link
            href="/all-tools"
            className="inline-flex items-center justify-center rounded-xl border border-border-color bg-card-bg px-5 py-3 text-[14px] font-semibold text-primary-text transition-colors hover:bg-hover-bg"
          >
            Browse all tools
          </Link>
        </div>
      </div>

      <div className="mt-16 border-t border-border-color pt-10">
        <h2 className="font-heading text-[13px] font-bold uppercase tracking-wider text-secondary-text">
          Browse by category
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/tools/${category.slug}`}
              className="rounded-full border border-border-color bg-card-bg px-3.5 py-1.5 text-[13px] font-medium text-secondary-text transition-colors hover:border-secondary-text/30 hover:text-primary-text"
            >
              {category.label}
              <span className="ml-1.5 text-secondary-text/60">
                {toolsInCategory(category.slug).length}
              </span>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 font-heading text-[13px] font-bold uppercase tracking-wider text-secondary-text">
          Popular tools
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {POPULAR_TOOLS.slice(0, 8).map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/${tool.slug}`}
                className="block rounded-lg px-3 py-2 text-[14px] text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
              >
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
