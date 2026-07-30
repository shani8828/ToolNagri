import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Code2,
  FileText,
  Image as ImageIcon,
  Shield,
  TrendingUp,
  Type,
  Zap,
} from "lucide-react";

import ToolCard from "@/components/ToolCard";
import SearchTrigger from "@/components/SearchTrigger";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { POPULAR_TOOLS, TOOLS, toolsInCategory } from "@/lib/tools";
import { homeJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site";

/**
 * The homepage owns its own metadata rather than inheriting it from the root
 * layout. That keeps the root free of a canonical URL, so no child route can
 * accidentally inherit "/" as its canonical the way all 42 tool pages did.
 */
export const metadata = pageMetadata({
  title: "Free Online Tools — PDF, Image, Text & Developer Utilities",
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "free online tools",
    "online utilities",
    "browser tools",
    "free web tools no signup",
  ],
});

const CATEGORY_ICONS: Record<CategorySlug, typeof FileText> = {
  pdf: FileText,
  image: ImageIcon,
  text: Type,
  developer: Code2,
  calculators: Calculator,
  seo: TrendingUp,
  network: Shield,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeJsonLd() }}
      />

      {/* ───────────────────────────── Hero ───────────────────────────── */}
      <section className="border-b border-border-color overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title and Search/Links */}
            <div className="animate-fade-up lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-color bg-secondary-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-text">
                <Zap aria-hidden className="h-3 w-3" />
                {TOOLS.length} tools · no signup
              </span>

              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-primary-text sm:text-5xl lg:text-6xl">
                Free online tools that run
                <br className="hidden sm:block" /> entirely in your browser
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-secondary-text md:text-lg">
                Merge PDFs, compress images, format JSON, generate QR codes and calculate loan EMIs
                — {TOOLS.length} utilities that process your files locally. Nothing is uploaded,
                nothing is stored, and there are no limits or accounts.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchTrigger className="w-full sm:w-80" />
                <Link
                  href="/all-tools"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-background transition-colors hover:bg-accent-light"
                >
                  Browse all tools
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Storyset Illustration */}
            <div className="animate-fade-in lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none aspect-3/2 flex items-center justify-center">
                <img
                  src="/ecotourism-rafiki.svg"
                  alt="Web tools illustration by Storyset"
                  className="w-full h-auto object-contain max-h-80 sm:max-h-95 lg:max-h-110"
                />
              </div>
              {/* <span className="mt-4 text-[11px] text-secondary-text/60">
                <a
                  href="https://storyset.com/people"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-text hover:underline"
                >
                  People illustrations by Storyset
                </a>
              </span> */}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── Browse by category ─────────────────────── */}
      <section className="border-b border-border-color bg-secondary-bg/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-primary-text md:text-3xl">
                Browse by category
              </h2>
              <p className="mt-2 text-[14px] text-secondary-text">
                Seven collections covering documents, media, code and everyday maths.
              </p>
            </div>
          </div>

          <div className="stagger mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.slug];
              const tools = toolsInCategory(category.slug);

              return (
                <Link
                  key={category.slug}
                  href={`/tools/${category.slug}`}
                  className="group flex flex-col rounded-2xl border border-border-color bg-card-bg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary-text/30 hover:shadow-card-hover"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-primary-text transition-colors duration-200 group-hover:bg-primary-text group-hover:text-background">
                      <Icon aria-hidden className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[12px] font-medium text-secondary-text">
                      {tools.length} tools
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-[16px] font-bold text-primary-text">
                    {category.label}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-secondary-text">
                    {category.tagline}
                  </p>

                  <p className="mt-4 line-clamp-1 text-[12px] text-secondary-text/70">
                    {tools
                      .slice(0, 4)
                      .map((t) => t.name)
                      .join(" · ")}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────── Popular tools ─────────────────────────── */}
      <section className="border-b border-border-color">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-primary-text md:text-3xl">
              Most used
            </h2>
            <Link
              href="/all-tools"
              className="shrink-0 text-[13px] font-semibold text-secondary-text underline-offset-4 hover:text-primary-text hover:underline"
            >
              View all {TOOLS.length} →
            </Link>
          </div>

          <div className="stagger mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_TOOLS.slice(0, 8).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Why ────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-primary-text md:text-3xl">
            Why these tools are different
          </h2>

          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                term: "Your files never leave",
                detail:
                  "PDFs, images and text are processed by your own browser. There is no upload step, so there is no copy of your data on a server to leak or subpoena.",
              },
              {
                term: "No round trip, no wait",
                detail:
                  "Because the work happens locally, results appear immediately. No queue, no progress bar waiting on someone else's server.",
              },
              {
                term: "No accounts or limits",
                detail:
                  "No signup wall, no daily conversion cap, no watermark on the output and no email address required to download your own file.",
              },
              {
                term: "Works offline",
                detail:
                  "Once a tool page has loaded, most tools keep working without a connection. Handy on planes, trains and bad hotel Wi-Fi.",
              },
            ].map((item) => (
              <div key={item.term}>
                <dt className="font-heading text-[15px] font-bold text-primary-text">
                  {item.term}
                </dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-secondary-text">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
