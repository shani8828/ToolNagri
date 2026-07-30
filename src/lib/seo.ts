/**
 * Metadata and structured-data builders.
 *
 * Every route's canonical URL and Open Graph block is produced here. This
 * matters: the root layout previously set `alternates.canonical: "/"`, and
 * because Next.js merges metadata from parent to child, all 42 tool pages
 * inherited it and declared themselves duplicates of the homepage. Building
 * metadata through these helpers makes a per-route canonical the default
 * rather than something each layout has to remember.
 */
import type { Metadata } from "next";
import { CATEGORIES, getCategory, type Category, type CategorySlug } from "./categories";
import { getTool, toolsInCategory, type Tool } from "./tools";
import {
  CONTACT_EMAIL,
  ORG_NAME,
  ORG_URL,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "./site";

/* ────────────────────────────── Metadata ────────────────────────────── */

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Set for utility pages that shouldn't compete in search results. */
  noIndex?: boolean;
}

/**
 * Base builder. Always emits an explicit canonical and a matching og:url so
 * no route can silently inherit the wrong one.
 */
/**
 * Shared social card.
 *
 * Declaring `openGraph` on a route replaces the object inherited from the root
 * layout, which drops the image the `opengraph-image` file convention would
 * otherwise contribute. Referencing it explicitly keeps every page shareable.
 */
const OG_IMAGE = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} - free online tools that run in your browser`,
};

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  noIndex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          // Full-size image thumbnails and untruncated snippets in results.
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/** Metadata for a tool page, derived from the catalogue entry. */
export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);

  if (!tool) {
    // A layout referencing an unknown slug is a wiring mistake, not a runtime
    // condition. Fail loudly at build time rather than shipping bad metadata.
    throw new Error(
      `toolMetadata("${slug}"): no such tool in src/lib/tools.ts. ` +
        `Add the entry or correct the slug.`,
    );
  }

  return pageMetadata({
    title: tool.seoTitle,
    description: tool.seoDescription,
    path: `/${tool.slug}`,
    keywords: tool.keywords,
  });
}

/** Metadata for a category hub page. */
export function categoryMetadata(slug: CategorySlug): Metadata {
  const category = getCategory(slug);
  if (!category) throw new Error(`categoryMetadata("${slug}"): unknown category.`);

  return pageMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: `/tools/${category.slug}`,
    keywords: toolsInCategory(slug).flatMap((t) => t.keywords.slice(0, 2)),
  });
}

/* ─────────────────────────── Structured data ─────────────────────────── */

type Json = Record<string, unknown>;

/** Wraps one or more JSON-LD nodes in an @graph document. */
export function jsonLdGraph(nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}

export function organizationNode(): Json {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: ORG_URL,
    email: CONTACT_EMAIL,
  };
}

export function websiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbNode(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * Describes a tool as a free web application.
 *
 * Deliberately omits `aggregateRating` - there are no real user ratings to
 * report, and inventing them is both dishonest and a spam signal.
 */
export function softwareApplicationNode(tool: Tool, category: Category): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": `${absoluteUrl(`/${tool.slug}`)}#app`,
    name: (tool.seoTitle.includes("-")
      ? tool.seoTitle.split("-")[0]
      : tool.seoTitle.split("-")[0])!.trim(),
    url: absoluteUrl(`/${tool.slug}`),
    description: tool.seoDescription,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: category.label,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Runs in any modern browser.",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqNode(faqs: { question: string; answer: string }[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** HowTo markup built from the numbered steps already shown on tool pages. */
export function howToNode(tool: Tool, steps: string[]): Json | null {
  if (steps.length < 2) return null;
  return {
    "@type": "HowTo",
    name: `How to use the ${tool.name}`,
    description: tool.seoDescription,
    totalTime: "PT1M",
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
  };
}

export function collectionPageNode(category: Category, tools: Tool[]): Json {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(`/tools/${category.slug}`)}#collection`,
    url: absoluteUrl(`/tools/${category.slug}`),
    name: category.label,
    description: category.seoDescription,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: absoluteUrl(`/${tool.slug}`),
      })),
    },
  };
}

/** Homepage graph: identity plus a sitelinks search box. */
export function homeJsonLd(): string {
  return jsonLdGraph([
    organizationNode(),
    {
      ...websiteNode(),
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/all-tools?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      name: "Tool categories",
      itemListElement: CATEGORIES.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        url: absoluteUrl(`/tools/${c.slug}`),
      })),
    },
  ]);
}
