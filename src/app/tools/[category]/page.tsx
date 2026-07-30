import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import ToolCard from "@/components/ToolCard";
import { CATEGORIES, getCategory, type CategorySlug } from "@/lib/categories";
import { toolsInCategory, TOOLS } from "@/lib/tools";
import {
  breadcrumbNode,
  categoryMetadata,
  collectionPageNode,
  jsonLdGraph,
} from "@/lib/seo";

type Params = { category: string };

/** Prerender all seven hubs at build time. */
export function generateStaticParams(): Params[] {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

/** Anything outside the known slugs is a real 404, not a fallback page. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  if (!getCategory(slug)) return {};
  return categoryMetadata(slug as CategorySlug);
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const tools = toolsInCategory(category.slug);
  const otherCategories = CATEGORIES.filter((c) => c.slug !== category.slug);

  const jsonLd = jsonLdGraph([
    collectionPageNode(category, tools),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "All Tools", path: "/all-tools" },
      { name: category.label, path: `/tools/${category.slug}` },
    ]),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-secondary-text">
          <li>
            <Link href="/" className="hover:text-primary-text">
              Home
            </Link>
          </li>
          <ChevronRight aria-hidden className="h-3 w-3 shrink-0" />
          <li>
            <Link href="/all-tools" className="hover:text-primary-text">
              All Tools
            </Link>
          </li>
          <ChevronRight aria-hidden className="h-3 w-3 shrink-0" />
          <li aria-current="page" className="font-medium text-primary-text">
            {category.label}
          </li>
        </ol>
      </nav>

      <header className="animate-fade-up max-w-3xl">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-primary-text md:text-[2.75rem] md:leading-[1.08]">
          {category.label}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-secondary-text md:text-base">
          {category.intro}
        </p>
        <p className="mt-4 text-[13px] font-medium text-secondary-text">
          {tools.length} {tools.length === 1 ? "tool" : "tools"} in this category
        </p>
      </header>

      <div className="stagger mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {/* Cross-links to the other hubs — spreads crawl depth and link equity. */}
      <section className="mt-20 border-t border-border-color pt-12">
        <h2 className="font-heading text-xl font-bold text-primary-text md:text-2xl">
          Other categories
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherCategories.map((other) => (
            <Link
              key={other.slug}
              href={`/tools/${other.slug}`}
              className="group rounded-xl border border-border-color bg-card-bg p-4 transition-all duration-200 hover:border-secondary-text/30 hover:shadow-card-hover"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-heading text-[14px] font-bold text-primary-text">
                  {other.label}
                </h3>
                <span className="shrink-0 text-[11px] text-secondary-text">
                  {toolsInCategory(other.slug).length}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-secondary-text">
                {other.tagline}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/all-tools"
          className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-background transition-colors hover:bg-accent-light"
        >
          Browse all {TOOLS.length} tools
          <span aria-hidden>→</span>
        </Link>
      </section>
    </div>
  );
}
