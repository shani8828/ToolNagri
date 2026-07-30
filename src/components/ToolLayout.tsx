"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronRight, Plus, ShieldCheck, Zap } from "lucide-react";

import { getCategory } from "@/lib/categories";
import { getToolByPath, relatedTools as siblingTools } from "@/lib/tools";
import {
  breadcrumbNode,
  faqNode,
  howToNode,
  jsonLdGraph,
  softwareApplicationNode,
} from "@/lib/seo";

interface FAQItem {
  question: string;
  answer: string;
}

interface RelatedToolItem {
  name: string;
  url: string;
  description: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  /** Accepted for backward compatibility; the catalogue is authoritative. */
  category?: string;
  categoryUrl?: string;
  howToUse: string[];
  benefits: string[];
  faqs: FAQItem[];
  /** Accepted for backward compatibility; siblings are derived by category. */
  relatedTools?: RelatedToolItem[];
  children: React.ReactNode;
}

/**
 * Shared shell for every tool page.
 *
 * Two things changed from the original beyond styling:
 *
 * 1. Category, breadcrumbs and related tools are now derived from
 *    `src/lib/tools.ts` rather than hand-passed per page, so a tool can never
 *    disagree with the catalogue about which category it belongs to.
 * 2. It emits JSON-LD. These pages are statically prerendered, so the markup
 *    lands in the HTML crawlers receive even though this is a client component.
 *
 * framer-motion was removed here: it was ~34 kB gzipped on every tool page for
 * three entrance transitions that CSS keyframes handle just as well.
 */
export default function ToolLayout({
  title,
  description,
  category: categoryProp,
  howToUse,
  benefits,
  faqs,
  children,
}: ToolLayoutProps) {
  const pathname = usePathname();
  const tool = getToolByPath(pathname);
  const category = tool ? getCategory(tool.category) : undefined;

  const categoryLabel = category?.label ?? categoryProp ?? "Tools";
  const categoryHref = category ? `/tools/${category.slug}` : "/all-tools";

  // Unknown tools fall back to the cautious claim rather than the reassuring one.
  const isLocal = tool ? (tool.processing ?? "local") === "local" : false;

  const related = tool
    ? siblingTools(tool.slug, 3).map((t) => ({
        name: t.name,
        url: `/${t.slug}`,
        description: t.tagline,
      }))
    : [];

  // Structured data. Nodes that don't apply return null and are filtered out.
  const jsonLd =
    tool && category
      ? jsonLdGraph(
          [
            softwareApplicationNode(tool, category),
            breadcrumbNode([
              { name: "Home", path: "/" },
              { name: category.label, path: `/tools/${category.slug}` },
              { name: tool.name, path: `/${tool.slug}` },
            ]),
            faqNode(faqs),
            howToNode(tool, howToUse),
          ].filter((node): node is Record<string, unknown> => node !== null),
        )
      : null;

  return (
    <div className="bg-background">
      {jsonLd && (
        <script
          type="application/ld+json"
          // Content is built from our own catalogue, not user input.
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-secondary-text">
            <li>
              <Link href="/" className="hover:text-primary-text">
                Home
              </Link>
            </li>
            <ChevronRight aria-hidden className="h-3 w-3 shrink-0" />
            <li>
              <Link href={categoryHref} className="hover:text-primary-text">
                {categoryLabel}
              </Link>
            </li>
            <ChevronRight aria-hidden className="h-3 w-3 shrink-0" />
            <li aria-current="page" className="font-medium text-primary-text">
              {tool?.name ?? title}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="animate-fade-up mb-8 md:mb-10">
          <Link
            href={categoryHref}
            className="inline-flex items-center rounded-full border border-border-color bg-secondary-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-text transition-colors hover:text-primary-text"
          >
            {categoryLabel}
          </Link>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-primary-text md:text-[2.5rem] md:leading-[1.1]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-secondary-text md:text-base">
            {description}
          </p>

          {/*
            Badges reflect what the tool actually does. Most tools run entirely
            in the browser and can say so; the handful that send input to a
            server must not inherit that claim, or the promise means nothing
            anywhere on the site.
          */}
          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-secondary-text">
            {isLocal ? (
              <>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-success" />
                  Runs in your browser
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Zap aria-hidden className="h-3.5 w-3.5 text-success" />
                  Files never uploaded
                </li>
              </>
            ) : (
              <>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-success" />
                  Nothing stored
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Zap aria-hidden className="h-3.5 w-3.5 text-success" />
                  No signup
                </li>
              </>
            )}
            <li className="inline-flex items-center gap-1.5">
              <Check aria-hidden className="h-3.5 w-3.5 text-success" />
              Free to use
            </li>
          </ul>
        </header>

        {/* The tool itself */}
        <section
          aria-label={`${tool?.name ?? title} tool`}
          className="animate-fade-up mb-14 rounded-2xl border border-border-color bg-card-bg p-5 shadow-card md:p-8"
        >
          {children}
        </section>

        {/* How to use + benefits */}
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-12">
          <section className="md:col-span-3">
            <h2 className="font-heading text-xl font-bold text-primary-text md:text-2xl">
              How to use {tool?.name ?? title}
            </h2>
            <ol className="mt-5 space-y-4">
              {howToUse.map((step, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-color bg-secondary-bg text-[11px] font-bold text-primary-text">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-[14px] leading-relaxed text-secondary-text">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="md:col-span-2">
            <h2 className="font-heading text-xl font-bold text-primary-text md:text-2xl">
              What you get
            </h2>
            <ul className="mt-5 space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2.5">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-[14px] leading-relaxed text-secondary-text">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* FAQs - native <details>, so the answers are in the HTML with no JS. */}
        {faqs.length > 0 && (
          <section className="mb-14 border-t border-border-color pt-12">
            <h2 className="font-heading text-xl font-bold text-primary-text md:text-2xl">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-border-color border-y border-border-color">
              {faqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-heading text-[15px] font-semibold text-primary-text">
                      {faq.question}
                    </h3>
                    <Plus
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-secondary-text transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-4 pr-8 text-[14px] leading-relaxed text-secondary-text">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related tools */}
        {related.length > 0 && (
          <section className="border-t border-border-color pt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-heading text-xl font-bold text-primary-text md:text-2xl">
                Related tools
              </h2>
              <Link
                href={categoryHref}
                className="text-[13px] font-semibold text-secondary-text underline-offset-4 hover:text-primary-text hover:underline"
              >
                All {categoryLabel} →
              </Link>
            </div>
            <div className="stagger mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className="group rounded-xl border border-border-color bg-card-bg p-4 transition-all duration-200 hover:border-secondary-text/30 hover:shadow-card-hover"
                >
                  <h3 className="font-heading text-[14px] font-bold text-primary-text">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-secondary-text">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
