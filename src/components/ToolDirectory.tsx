"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import ToolCard from "@/components/ToolCard";
import { CATEGORIES } from "@/lib/categories";
import { TOOLS, toolsInCategory } from "@/lib/tools";

/**
 * Filterable tool directory.
 *
 * The initial render has an empty query, so every tool is present in the
 * prerendered HTML that crawlers receive — filtering is a progressive
 * enhancement on top of a complete, indexable list.
 */
export default function ToolDirectory() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return CATEGORIES.map((category) => {
      const tools = toolsInCategory(category.slug).filter(
        (tool) =>
          !term ||
          tool.name.toLowerCase().includes(term) ||
          tool.tagline.toLowerCase().includes(term) ||
          tool.keywords.some((k) => k.includes(term)),
      );
      return { category, tools };
    }).filter((group) => group.tools.length > 0);
  }, [term]);

  const matchCount = groups.reduce((sum, g) => sum + g.tools.length, 0);

  return (
    <>
      {/* Filter */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-border-color bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5 rounded-xl border border-border-color bg-card-bg px-3.5 py-2.5 shadow-card focus-within:border-secondary-text/40">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-secondary-text" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${TOOLS.length} tools by name or keyword…`}
            aria-label="Filter tools"
            className="w-full bg-transparent text-[14px] text-primary-text placeholder-secondary-text outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear filter"
              className="rounded p-0.5 text-secondary-text hover:text-primary-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {term && (
          <p aria-live="polite" className="mt-2.5 text-center text-[12px] text-secondary-text">
            {matchCount} {matchCount === 1 ? "tool" : "tools"} match “{query}”
          </p>
        )}
      </div>

      {/* Category jump links — only useful when showing everything. */}
      {!term && (
        <nav aria-label="Jump to category" className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="rounded-full border border-border-color bg-card-bg px-3 py-1.5 text-[12.5px] font-medium text-secondary-text transition-colors hover:border-secondary-text/30 hover:text-primary-text"
            >
              {category.name}
              <span className="ml-1.5 text-secondary-text/60">
                {toolsInCategory(category.slug).length}
              </span>
            </a>
          ))}
        </nav>
      )}

      {/* Grouped listings */}
      <div className="mt-12 space-y-14">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-color py-20 text-center">
            <p className="text-[15px] font-semibold text-primary-text">No tools match “{query}”</p>
            <p className="mt-1.5 text-[13px] text-secondary-text">
              Try a broader term like “pdf”, “image”, “json” or “calculator”.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-5 rounded-lg bg-accent px-4 py-2 text-[13px] font-semibold text-background hover:bg-accent-light"
            >
              Clear filter
            </button>
          </div>
        ) : (
          groups.map(({ category, tools }) => (
            <section key={category.slug} id={category.slug} className="scroll-mt-36">
              <div className="flex items-baseline justify-between gap-4 border-b border-border-color pb-3">
                <div>
                  <h2 className="font-heading text-lg font-bold text-primary-text md:text-xl">
                    {category.label}
                  </h2>
                  <p className="mt-1 text-[13px] text-secondary-text">{category.tagline}</p>
                </div>
                <Link
                  href={`/tools/${category.slug}`}
                  className="shrink-0 text-[12.5px] font-semibold text-secondary-text underline-offset-4 hover:text-primary-text hover:underline"
                >
                  Hub →
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
