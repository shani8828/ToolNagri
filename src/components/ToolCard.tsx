import { createElement } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getIcon } from "@/lib/tool-icons";
import type { IconName } from "@/lib/tool-icons";
import type { Tool } from "@/lib/tools";

/**
 * Renders a catalogue icon by name.
 *
 * `createElement` rather than assigning to a capitalised variable and using
 * JSX: the registry returns a stable module-level reference, but a linter
 * can't prove that through a function call and flags it as a component being
 * created during render.
 */
function ToolGlyph({ name, className }: { name: IconName; className: string }) {
  return createElement(getIcon(name), { className, "aria-hidden": true });
}

/**
 * Server component - the tool grids render with no client JS at all.
 * Hover and focus states are pure CSS.
 */
export default function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  if (compact) {
    return (
      <Link
        href={`/${tool.slug}`}
        className="group flex items-center gap-3 rounded-xl border border-border-color bg-card-bg px-3.5 py-3 transition-all duration-200 hover:border-secondary-text/30 hover:shadow-card-hover"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-bg text-primary-text">
          <ToolGlyph name={tool.icon} className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-semibold text-primary-text">
            {tool.name}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-secondary-text">
            {tool.tagline}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 shrink-0 text-secondary-text/40 transition-all duration-200 group-hover:text-primary-text"
        />
      </Link>
    );
  }

  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border-color bg-card-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary-text/30 hover:shadow-card-hover"
    >
      <div className="mb-3.5 flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-primary-text transition-colors duration-200 group-hover:bg-primary-text group-hover:text-background">
          <ToolGlyph name={tool.icon} className="h-[18px] w-[18px]" />
        </span>
        {tool.popular && (
          <span className="rounded-full border border-border-color px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-text">
            Popular
          </span>
        )}
      </div>

      <h3 className="font-heading text-[15px] font-bold text-primary-text">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-secondary-text">
        {tool.tagline}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-secondary-text transition-colors group-hover:text-primary-text">
        Open tool
        <ArrowUpRight
          aria-hidden
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}
