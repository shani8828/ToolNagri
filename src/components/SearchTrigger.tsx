"use client";

import { Search } from "lucide-react";

import { SEARCH_OPEN_EVENT } from "@/lib/events";
import { TOOLS } from "@/lib/tools";

/**
 * Tiny client island so the rest of the homepage can stay a server component.
 * Rather than duplicating the search dialog, it asks the header to open its
 * own via a window event.
 */
export default function SearchTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT))}
      className={`group inline-flex items-center gap-2.5 rounded-xl border border-border-color bg-card-bg px-4 py-3 text-left shadow-card transition-all duration-200 hover:border-secondary-text/30 hover:shadow-card-hover ${className}`}
    >
      <Search aria-hidden className="h-4 w-4 shrink-0 text-secondary-text" />
      <span className="flex-1 text-[14px] text-secondary-text">
        Search {TOOLS.length} tools…
      </span>
      <kbd className="hidden rounded border border-border-color bg-secondary-bg px-1.5 py-0.5 font-sans text-[10px] font-medium text-secondary-text sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}
