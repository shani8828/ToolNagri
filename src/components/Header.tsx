"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Calculator,
  ChevronDown,
  Code2,
  Download,
  FileText,
  Image as ImageIcon,
  Menu,
  Search,
  Shield,
  TrendingUp,
  Type,
  X,
  Palette,
} from "lucide-react";

import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { SEARCH_OPEN_EVENT } from "@/lib/events";
import { TOOLS, toolsInCategory, type Tool } from "@/lib/tools";

/*
  The seven category icons are imported directly rather than through the
  shared icon registry. The header renders on every route, so pulling in the
  full 38-icon map here would put all of them in the bundle for every page.
*/
const CATEGORY_ICONS: Record<CategorySlug, typeof FileText> = {
  pdf: FileText,
  image: ImageIcon,
  text: Type,
  developer: Code2,
  calculators: Calculator,
  seo: TrendingUp,
  social: Download,
  network: Shield,
  design: Palette,
};

/** Delay before a hovered category opens, so cursor fly-through doesn't flicker. */
const HOVER_OPEN_MS = 90;
/** Grace period when leaving, so moving cursor into the panel doesn't close it. */
const HOVER_CLOSE_MS = 140;

export default function Header() {
  const pathname = usePathname();
  const [openCategory, setOpenCategory] = useState<CategorySlug | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleOpen = useCallback(
    (slug: CategorySlug) => {
      clearTimers();
      openTimer.current = setTimeout(() => setOpenCategory(slug), HOVER_OPEN_MS);
    },
    [clearTimers],
  );

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpenCategory(null), HOVER_CLOSE_MS);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  /*
    Close everything on navigation.

    Adjusted during render rather than in an effect: setState inside an effect
    would paint the new route with the menu still open and then immediately
    re-render to close it. This is React's documented pattern for resetting
    state when a value changes.
  */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenCategory(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  // Escape closes the mega menu; Ctrl/Cmd+K toggles search.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpenCategory(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lets server-rendered pages open the dialog without duplicating it.
  useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener(SEARCH_OPEN_EVENT, open);
    return () => window.removeEventListener(SEARCH_OPEN_EVENT, open);
  }, []);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const activeCategory = openCategory ? CATEGORIES.find((c) => c.slug === openCategory) : null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-color bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            {/* Wordmark */}
            <Link
              href="/"
              className="shrink-0 font-heading text-[17px] font-bold tracking-tight text-primary-text"
            >
              Tool<span className="text-secondary-text">Nagri</span>
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Tool categories"
              className="hidden lg:flex items-center gap-0.5 ml-2"
              onPointerLeave={scheduleClose}
            >
              <Link
                href="/all-tools"
                className={`rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  pathname === "/all-tools"
                    ? "text-primary-text"
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                All Tools
              </Link>

              {CATEGORIES.map((category) => {
                const isOpen = openCategory === category.slug;
                const isCurrent = pathname === `/tools/${category.slug}`;
                return (
                  <button
                    key={category.slug}
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onPointerEnter={() => scheduleOpen(category.slug)}
                    onFocus={() => setOpenCategory(category.slug)}
                    onClick={() =>
                      setOpenCategory((prev) => (prev === category.slug ? null : category.slug))
                    }
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                      isOpen || isCurrent
                        ? "text-primary-text"
                        : "text-secondary-text hover:text-primary-text"
                    }`}
                  >
                    {category.name}
                    <ChevronDown
                      aria-hidden
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="flex-1" />

            {/* Search trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border-color bg-secondary-bg px-3 py-1.5 text-[13px] text-secondary-text transition-colors hover:border-secondary-text/40 hover:text-primary-text"
            >
              <Search aria-hidden className="h-3.5 w-3.5" />
              {/* Label and shortcut hint are dropped between lg and xl, where
                  eight category triggers already fill the row. */}
              <span className="hidden xl:inline">Search tools</span>
              <span className="lg:hidden xl:hidden">Search tools</span>
              <kbd className="ml-1 hidden rounded border border-border-color bg-background px-1.5 py-0.5 font-sans text-[10px] font-medium text-secondary-text xl:inline">
                Ctrl K
              </kbd>
            </button>

            {/* Mobile controls */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search tools"
              className="sm:hidden rounded-lg p-2 text-secondary-text hover:bg-hover-bg hover:text-primary-text"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="lg:hidden rounded-lg p-2 text-secondary-text hover:bg-hover-bg hover:text-primary-text"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop mega panel - one panel for every category, content swaps. */}
        {activeCategory && (
          <div
            className="absolute inset-x-0 top-full hidden lg:block"
            onPointerEnter={clearTimers}
            onPointerLeave={scheduleClose}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="animate-scale-in origin-top overflow-hidden rounded-b-2xl border border-t-0 border-border-color bg-background shadow-premium">
                <div className="grid grid-cols-12">
                  {/* Category summary */}
                  <div className="col-span-3 border-r border-border-color bg-secondary-bg/60 p-6">
                    <CategoryGlyph slug={activeCategory.slug} />
                    <h2 className="mt-3 font-heading text-base font-bold text-primary-text">
                      {activeCategory.label}
                    </h2>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-secondary-text">
                      {activeCategory.tagline}
                    </p>
                    <Link
                      href={`/tools/${activeCategory.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary-text hover:underline underline-offset-4"
                    >
                      View all {toolsInCategory(activeCategory.slug).length} tools
                      <span aria-hidden>→</span>
                    </Link>
                  </div>

                  {/* Tools in this category */}
                  <div className="col-span-9 p-4">
                    <ul className="grid grid-cols-3 gap-1">
                      {toolsInCategory(activeCategory.slug).map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            href={`/${tool.slug}`}
                            className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-hover-bg"
                          >
                            <span className="block text-[13px] font-semibold text-primary-text">
                              {tool.name}
                            </span>
                            <span className="mt-0.5 block line-clamp-1 text-[12px] text-secondary-text">
                              {tool.tagline}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop for the desktop mega panel */}
      {activeCategory && (
        <div
          aria-hidden
          className="fixed inset-0 top-16 z-30 hidden bg-foreground/5 lg:block"
          onPointerEnter={scheduleClose}
        />
      )}

      {mobileOpen && <MobileMenu pathname={pathname} onClose={() => setMobileOpen(false)} />}
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/* ─────────────────────────── Category glyph ─────────────────────────── */

function CategoryGlyph({ slug }: { slug: CategorySlug }) {
  const Icon = CATEGORY_ICONS[slug];
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-color bg-background text-primary-text">
      <Icon aria-hidden className="h-4.5 w-4.5" />
    </span>
  );
}

/* ─────────────────────────── Mobile drawer ──────────────────────────── */

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const [expanded, setExpanded] = useState<CategorySlug | null>(() => {
    // Open the section containing the current page.
    const current = TOOLS.find((t) => `/${t.slug}` === pathname);
    return current?.category ?? null;
  });

  return (
    <div className="fixed inset-0 top-16 z-40 lg:hidden">
      <button
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/20"
      />
      <div className="animate-fade-in relative h-full overflow-y-auto overscroll-contain border-t border-border-color bg-background pb-24">
        <nav aria-label="Mobile navigation" className="px-4 py-3">
          <Link
            href="/all-tools"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-primary-text hover:bg-hover-bg"
          >
            All Tools
            <span className="text-xs font-medium text-secondary-text">{TOOLS.length}</span>
          </Link>

          <div className="my-2 h-px bg-border-color" />

          {CATEGORIES.map((category) => {
            const tools = toolsInCategory(category.slug);
            const isExpanded = expanded === category.slug;
            const panelId = `mobile-cat-${category.slug}`;

            return (
              <div key={category.slug} className="border-b border-border-color/70 last:border-0">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isExpanded ? null : category.slug)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-hover-bg"
                >
                  <CategoryGlyph slug={category.slug} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-primary-text">
                      {category.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-secondary-text">
                      {tools.length} tools · {category.tagline}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={`h-4 w-4 shrink-0 text-secondary-text transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <ul id={panelId} className="animate-fade-in space-y-0.5 pb-3 pl-13 pr-3">
                    {tools.map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          href={`/${tool.slug}`}
                          onClick={onClose}
                          className={`block rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
                            pathname === `/${tool.slug}`
                              ? "bg-hover-bg font-semibold text-primary-text"
                              : "text-secondary-text hover:bg-hover-bg hover:text-primary-text"
                          }`}
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={`/tools/${category.slug}`}
                        onClick={onClose}
                        className="block rounded-lg px-3 py-2.5 text-[13px] font-semibold text-primary-text hover:bg-hover-bg"
                      >
                        View all {category.name} tools →
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ─────────────────────────── Search dialog ──────────────────────────── */

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const term = query.trim().toLowerCase();
  const results: Tool[] = term
    ? TOOLS.filter(
        (tool) =>
          tool.name.toLowerCase().includes(term) ||
          tool.tagline.toLowerCase().includes(term) ||
          tool.keywords.some((k) => k.includes(term)),
      ).slice(0, 8)
    : TOOLS.filter((t) => t.popular).slice(0, 6);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Cursor resets where the query changes (see the input's onChange) rather
  // than in an effect, which would render one frame with a stale selection.

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/30 backdrop-blur-[2px]"
      />
      <div className="relative mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
          className="animate-scale-in overflow-hidden rounded-2xl border border-border-color bg-background shadow-premium"
        >
          <div className="flex items-center gap-3 border-b border-border-color px-4 py-3">
            <Search aria-hidden className="h-4 w-4 shrink-0 text-secondary-text" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCursor((c) => (results.length ? (c + 1) % results.length : 0));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
                } else if (e.key === "Enter" && results[cursor]) {
                  e.preventDefault();
                  window.location.href = `/${results[cursor].slug}`;
                } else if (e.key === "Escape") {
                  onClose();
                }
              }}
              placeholder={`Search ${TOOLS.length} tools…`}
              className="w-full bg-transparent text-[15px] text-primary-text placeholder-secondary-text outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded p-1 text-secondary-text hover:bg-hover-bg hover:text-primary-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul id={listId} role="listbox" className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin">
            {results.length === 0 ? (
              <li className="px-3 py-10 text-center text-sm text-secondary-text">
                No tools match <span className="font-semibold text-primary-text">{query}</span>
              </li>
            ) : (
              results.map((tool, i) => (
                <li key={tool.slug} role="option" aria-selected={i === cursor}>
                  <Link
                    href={`/${tool.slug}`}
                    onClick={onClose}
                    onPointerEnter={() => setCursor(i)}
                    className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${
                      i === cursor ? "bg-hover-bg" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-primary-text">
                        {tool.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-secondary-text">
                        {tool.tagline}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-md border border-border-color px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-text">
                      {CATEGORIES.find((c) => c.slug === tool.category)?.name}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>

          <div className="flex items-center justify-between border-t border-border-color bg-secondary-bg px-4 py-2 text-[11px] text-secondary-text">
            <span>↑↓ navigate · ↵ open · esc close</span>
            <span>
              {term ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
