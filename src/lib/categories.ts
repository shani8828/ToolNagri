/**
 * Tool taxonomy.
 *
 * Pure data - no React imports - so this module is safe to pull into server
 * components, the sitemap and route handlers without dragging UI into the
 * bundle. Icons are referenced by name and resolved in `tool-icons.ts`.
 *
 * Each category is a real search intent ("free pdf tools online") and gets its
 * own indexable hub page at /tools/<slug>.
 */
import type { IconName } from "./tool-icons";

export const CATEGORY_SLUGS = [
  "pdf",
  "image",
  "text",
  "developer",
  "calculators",
  "seo",
  "social",
  "network",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Category {
  slug: CategorySlug;
  /** Short label used in navigation. */
  name: string;
  /** Full label used in headings and breadcrumbs. */
  label: string;
  /** One-liner shown under the category heading and in the mega menu. */
  tagline: string;
  /** <title> for the category hub page. */
  seoTitle: string;
  /** <meta name="description"> for the category hub page. */
  seoDescription: string;
  /** Intro paragraph on the hub page. Also feeds the CollectionPage schema. */
  intro: string;
  icon: IconName;
}

export const CATEGORIES: Category[] = [
  {
    slug: "pdf",
    name: "PDF",
    label: "PDF Tools",
    tagline: "Merge, split, rotate and convert PDF files.",
    seoTitle: "Free PDF Tools Online - Merge, Split, Rotate & Convert",
    seoDescription:
      "Free online PDF tools that work in your browser. Merge, split, rotate and convert PDF files without uploading them to a server. No watermarks, no signup.",
    intro:
      "Every PDF tool here runs inside your browser using pdf-lib, which means your documents are never uploaded anywhere. Contracts, invoices and scanned IDs stay on your own device. There are no page limits, no watermarks and no account required.",
    icon: "file-text",
  },
  {
    slug: "image",
    name: "Image",
    label: "Image Tools",
    tagline: "Compress, convert and optimise images.",
    seoTitle: "Free Image Tools Online - Compress, Convert & Optimise",
    seoDescription:
      "Compress JPG and PNG files, convert between WebP, PNG and JPG, and optimise SVG code. Runs entirely in your browser - images never leave your device.",
    intro:
      "These image tools use the browser's own Canvas API to resize, compress and re-encode your files locally. Nothing is uploaded, so there is no wait for a round trip and no question about who else can see your photos.",
    icon: "image",
  },
  {
    slug: "text",
    name: "Text",
    label: "Text Tools",
    tagline: "Count, compare, convert and clean up text.",
    seoTitle: "Free Online Text Tools - Word Count, Diff, Case Converter",
    seoDescription:
      "Count words and characters, compare two texts, convert letter case, render Markdown and generate placeholder copy. Free, instant and fully client-side.",
    intro:
      "Writing and editing utilities that respond as you type. Useful for meeting word limits, proofreading revisions, reformatting pasted copy and generating filler content for mockups.",
    icon: "type",
  },
  {
    slug: "developer",
    name: "Developer",
    label: "Developer Tools",
    tagline: "Format, validate, encode and debug.",
    seoTitle: "Free Developer Tools Online - JSON, Base64, JWT, Regex",
    seoDescription:
      "Format and validate JSON, XML, SQL and YAML. Encode Base64, decode JWTs, test regular expressions and convert colours. Free, fast and fully client-side.",
    intro:
      "A working set of formatters, validators, encoders and debuggers. Because everything is processed locally, you can safely paste API payloads, tokens and production queries without sending them to a third-party server.",
    icon: "code",
  },
  {
    slug: "calculators",
    name: "Calculators",
    label: "Calculators & Converters",
    tagline: "Loans, percentages, ages, units and time zones.",
    seoTitle: "Free Online Calculators - EMI, Age, Percentage & Unit Converter",
    seoDescription:
      "Calculate loan EMIs and total interest, work out exact age, solve percentage problems, and convert units and time zones. Free and instant.",
    intro:
      "Everyday maths without the spreadsheet. Loan repayment schedules, precise age breakdowns, percentage change, unit conversion and time-zone comparison - all computed instantly as you change the inputs.",
    icon: "calculator",
  },
  {
    slug: "seo",
    name: "SEO",
    label: "SEO & Marketing Tools",
    tagline: "Short links, QR codes, UTM tags and slugs.",
    seoTitle: "Free SEO & Marketing Tools - URL Shortener, QR Codes, UTM Builder",
    seoDescription:
      "Shorten URLs with click tracking, generate custom QR codes, build UTM campaign links, create SEO slugs and grab YouTube thumbnails. Free to use.",
    intro:
      "Campaign plumbing for people who publish links. Build trackable UTM URLs, shorten them, turn them into QR codes for print, and keep your slugs clean and readable.",
    icon: "trending-up",
  },
  {
    slug: "social",
    name: "Social",
    label: "Social & Downloads",
    tagline: "Save reels, videos and thumbnails.",
    seoTitle: "Social Media Downloaders — Instagram & Facebook Reels, Free",
    seoDescription:
      "Download Instagram reels, Facebook reels and YouTube thumbnails in HD. Paste a public link and save the video — free, no signup and no watermark.",
    /*
      Note the deliberately different framing from every other category: these
      tools cannot run in the browser, because the platforms block cross-origin
      reads. Claiming "nothing leaves your device" here would be false.
    */
    intro:
      "Paste a public post link and save the video or image behind it. Unlike the rest of the site, these tools need a server step — the platforms block browsers from reading their media directly — so the link you paste is sent to our downloader service. Only public posts work, and nothing you download is stored. Please save only content you own or have permission to use.",
    icon: "download",
  },
  {
    slug: "network",
    name: "Network",
    label: "Network & Security Tools",
    tagline: "DNS records, IP lookup and strong passwords.",
    seoTitle: "Free Network & Security Tools - DNS Lookup, IP Address, Passwords",
    seoDescription:
      "Look up DNS records for any domain, check your public IP address and ISP details, and generate cryptographically secure passwords. Free and instant.",
    intro:
      "Diagnostics and hardening basics. Inspect how a domain resolves, see what the internet knows about your connection, and generate passwords using the browser's cryptographic random number generator.",
    icon: "shield",
  },
];

const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_BY_SLUG.get(slug as CategorySlug);
}

export function categoryUrl(slug: CategorySlug): string {
  return `/tools/${slug}`;
}
