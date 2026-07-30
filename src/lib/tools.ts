/**
 * The tool catalogue - single source of truth.
 *
 * Pure data (no React imports) so the sitemap, route handlers and server
 * components can read it without pulling UI into the bundle. Icons are
 * referenced by name and resolved through `tool-icons.ts`.
 *
 * `updated` is a real content date, not a build timestamp. Bump a tool's date
 * only when its page content actually changes - search engines learn to
 * distrust lastmod values that move on every deploy.
 */
import type { CategorySlug } from "./categories";
import type { IconName } from "./tool-icons";

export interface Tool {
  /** Route segment, without the leading slash. */
  slug: string;
  /** Short label for cards and navigation. */
  name: string;
  /** One-line summary shown on cards and in the mega menu. */
  tagline: string;
  /** Complete <title>. Written per tool for length and keyword control. */
  seoTitle: string;
  /** Complete <meta name="description">. */
  seoDescription: string;
  keywords: string[];
  category: CategorySlug;
  icon: IconName;
  /** ISO date of the last meaningful content change. */
  updated: string;
  popular?: boolean;
  trending?: boolean;
  isNew?: boolean;
}

const REVISED = "2026-07-30";

export const TOOLS: Tool[] = [
  // ─────────────────────────── PDF Tools ───────────────────────────
  {
    slug: "pdf-merge",
    name: "Merge PDF",
    tagline: "Combine several PDFs into one file and reorder pages first.",
    seoTitle: "Merge PDF Files Online Free - No Watermark, No Upload",
    seoDescription:
      "Combine multiple PDFs into a single file right in your browser. Reorder pages before merging, with no watermark, no page limit and nothing uploaded to a server.",
    keywords: ["merge pdf", "combine pdf", "pdf merger", "join pdf files free"],
    category: "pdf",
    icon: "layers",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "pdf-split",
    name: "Split PDF",
    tagline: "Extract single pages or page ranges from a PDF.",
    seoTitle: "Split PDF Online Free - Extract Pages Without Uploading",
    seoDescription:
      "Extract single pages or page ranges from any PDF document. Runs entirely in your browser so the file is never uploaded. Free, with no page limits.",
    keywords: ["split pdf", "extract pdf pages", "pdf splitter", "separate pdf pages"],
    category: "pdf",
    icon: "scissors",
    updated: REVISED,
  },
  {
    slug: "pdf-rotate",
    name: "Rotate PDF",
    tagline: "Turn selected pages or a whole document by 90, 180 or 270 degrees.",
    seoTitle: "Rotate PDF Online Free - Turn Pages 90°, 180° or 270°",
    seoDescription:
      "Rotate individual pages or an entire PDF by 90, 180 or 270 degrees and save the corrected file. Free, instant and fully client-side.",
    keywords: ["rotate pdf", "turn pdf pages", "fix pdf orientation"],
    category: "pdf",
    icon: "rotate",
    updated: REVISED,
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image",
    tagline: "Render PDF pages as high-quality PNG or JPG files.",
    seoTitle: "PDF to JPG & PNG Converter - Free, No Upload Required",
    seoDescription:
      "Convert PDF pages into high-quality PNG or JPG images in your browser. Choose the pages you need, with no signup and no watermark.",
    keywords: ["pdf to jpg", "pdf to png", "pdf to image", "convert pdf to picture"],
    category: "pdf",
    icon: "file-image",
    updated: REVISED,
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    tagline: "Turn JPG and PNG images into one tidy PDF document.",
    seoTitle: "Image to PDF Converter - JPG & PNG to PDF Free Online",
    seoDescription:
      "Turn JPG, PNG and JPEG images into a single clean PDF. Reorder pages before converting, keep full quality and never upload your photos.",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photo to pdf converter"],
    category: "pdf",
    icon: "file-text",
    updated: REVISED,
  },
  {
    slug: "base64-pdf",
    name: "Base64 to PDF",
    tagline: "Decode Base64 into a PDF, or encode a PDF into Base64.",
    seoTitle: "Base64 to PDF Converter - Encode & Decode PDF Free",
    seoDescription:
      "Decode a Base64 string back into a downloadable PDF, or upload a PDF to extract its Base64 data URL. Instant and fully client-side.",
    keywords: ["base64 to pdf", "pdf to base64", "decode pdf base64"],
    category: "pdf",
    icon: "binary",
    updated: REVISED,
  },

  // ────────────────────────── Image Tools ──────────────────────────
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink JPG, PNG and WebP files with a live quality preview.",
    seoTitle: "Compress Image Online Free - Reduce JPG & PNG File Size",
    seoDescription:
      "Reduce JPG, PNG and WebP file size using an adjustable quality slider with a live preview. Compression happens in your browser, so images stay private.",
    keywords: [
      "compress image",
      "reduce image size",
      "compress jpg",
      "image compressor online free",
    ],
    category: "image",
    icon: "shrink",
    updated: REVISED,
    popular: true,
    trending: true,
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    tagline: "Convert between PNG, JPG, WebP and BMP formats.",
    seoTitle: "Image Converter - PNG, JPG, WebP & BMP Free Online",
    seoDescription:
      "Convert images between PNG, JPG, JPEG, WebP and BMP without uploading them anywhere. Quality is preserved and the tool is completely free.",
    keywords: ["image converter", "png to jpg", "webp to png", "convert image format"],
    category: "image",
    icon: "replace",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "jpg-to-webp",
    name: "JPG to WebP",
    tagline: "Convert photos to WebP to cut page weight.",
    seoTitle: "JPG to WebP Converter - Shrink Images for Faster Sites",
    seoDescription:
      "Convert JPG and PNG images to WebP to reduce page weight and improve Core Web Vitals. Free, instant and processed entirely in your browser.",
    keywords: ["jpg to webp", "png to webp", "convert to webp", "webp converter"],
    category: "image",
    icon: "file-image",
    updated: REVISED,
  },
  {
    slug: "base64-image",
    name: "Base64 Image",
    tagline: "Encode an image to a data URL, or preview one from Base64.",
    seoTitle: "Base64 Image Encoder & Decoder - Free Data URL Tool",
    seoDescription:
      "Convert an image into a Base64 data URL for inline CSS or HTML, or paste a Base64 string to preview and download the image. Client-side only.",
    keywords: ["base64 image", "image to base64", "data url encoder"],
    category: "image",
    icon: "binary",
    updated: REVISED,
  },
  {
    slug: "svg-optimizer",
    name: "SVG Optimizer",
    tagline: "Strip metadata and minify SVG markup.",
    seoTitle: "SVG Optimizer - Minify & Clean SVG Code Online Free",
    seoDescription:
      "Strip editor metadata, remove empty groups and minify SVG markup to cut file size. Compare before and after, then copy the optimised code.",
    keywords: ["svg optimizer", "minify svg", "clean svg code", "compress svg"],
    category: "image",
    icon: "code",
    updated: REVISED,
  },

  // ─────────────────────────── Text Tools ──────────────────────────
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Live word, sentence and reading-time analysis.",
    seoTitle: "Word Counter - Count Words, Characters & Reading Time",
    seoDescription:
      "Count words, characters, sentences and paragraphs as you type, with estimated reading time and keyword density. Free, with no length limit.",
    keywords: ["word counter", "count words", "word count tool", "reading time calculator"],
    category: "text",
    icon: "align-left",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    tagline: "Count characters with and without spaces.",
    seoTitle: "Character Counter - Count Characters With & Without Spaces",
    seoDescription:
      "Count characters with and without spaces, plus letters, numbers, lines and words. Ideal for meta descriptions, social posts and form limits.",
    keywords: ["character counter", "count characters", "letter count", "text length"],
    category: "text",
    icon: "case-sensitive",
    updated: REVISED,
  },
  {
    slug: "text-diff",
    name: "Text Diff",
    tagline: "Compare two texts and highlight every change.",
    seoTitle: "Text Diff Checker - Compare Two Texts Online Free",
    seoDescription:
      "Compare two blocks of text side by side and highlight every addition, deletion and change. Free, instant and fully client-side.",
    keywords: ["text diff", "compare text", "diff checker", "text comparison tool"],
    category: "text",
    icon: "arrow-left-right",
    updated: REVISED,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Switch between upper, lower, title, camel and snake case.",
    seoTitle: "Case Converter - UPPERCASE, lowercase, Title & camelCase",
    seoDescription:
      "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and kebab-case with a single click.",
    keywords: ["case converter", "uppercase to lowercase", "title case converter", "camelcase"],
    category: "text",
    icon: "type",
    updated: REVISED,
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    tagline: "Render Markdown to clean HTML with a live preview.",
    seoTitle: "Markdown to HTML Converter - Live Preview, Free Online",
    seoDescription:
      "Convert Markdown into clean HTML with a live side-by-side preview, then copy the output. Supports headings, lists, links, tables and code blocks.",
    keywords: ["markdown to html", "md to html", "markdown converter", "markdown preview"],
    category: "text",
    icon: "file-code",
    updated: REVISED,
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum",
    tagline: "Generate placeholder copy for mockups.",
    seoTitle: "Lorem Ipsum Generator - Free Placeholder Text for Mockups",
    seoDescription:
      "Generate placeholder paragraphs, sentences or words for design mockups and prototypes. Choose the length and copy the result instantly.",
    keywords: ["lorem ipsum", "placeholder text", "dummy text generator", "filler text"],
    category: "text",
    icon: "text-quote",
    updated: REVISED,
  },

  // ──────────────────────── Developer Tools ────────────────────────
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Beautify, minify and validate JSON with clear errors.",
    seoTitle: "JSON Formatter & Validator - Beautify or Minify JSON Free",
    seoDescription:
      "Format, validate and minify JSON with error messages that point to the exact line. Runs locally, so you can safely paste real API payloads.",
    keywords: ["json formatter", "json validator", "beautify json", "json prettify"],
    category: "developer",
    icon: "braces",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "base64",
    name: "Base64 Encoder",
    tagline: "Encode and decode Base64 text with correct UTF-8 handling.",
    seoTitle: "Base64 Encoder & Decoder - Free Online Converter",
    seoDescription:
      "Encode text to Base64 or decode Base64 back to plain text instantly. Handles UTF-8 correctly and never sends your data anywhere.",
    keywords: ["base64 encode", "base64 decode", "base64 converter"],
    category: "developer",
    icon: "binary",
    updated: REVISED,
  },
  {
    slug: "csv-json",
    name: "CSV ↔ JSON",
    tagline: "Convert CSV to a JSON array and back again.",
    seoTitle: "CSV to JSON Converter - Two-Way, Free & Client-Side",
    seoDescription:
      "Convert CSV data into a JSON array, or serialise JSON back into CSV. Paste directly or upload a file - everything is processed in your browser.",
    keywords: ["csv to json", "json to csv", "csv converter", "convert csv"],
    category: "developer",
    icon: "table",
    updated: REVISED,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    tagline: "Indent messy queries or minify them to one line.",
    seoTitle: "SQL Formatter & Minifier - Beautify SQL Queries Online",
    seoDescription:
      "Format messy SQL into readable, properly indented queries, or minify them to a single line. Safe for production queries - nothing is uploaded.",
    keywords: ["sql formatter", "format sql", "sql beautifier", "sql minifier"],
    category: "developer",
    icon: "database",
    updated: REVISED,
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    tagline: "Prettify and validate raw XML documents.",
    seoTitle: "XML Formatter & Validator - Beautify XML Online Free",
    seoDescription:
      "Prettify and validate raw XML with proper indentation and syntax checking. Free, instant and fully client-side.",
    keywords: ["xml formatter", "format xml", "xml beautifier", "xml validator"],
    category: "developer",
    icon: "file-code",
    updated: REVISED,
  },
  {
    slug: "json-yaml",
    name: "JSON ↔ YAML",
    tagline: "Convert between JSON and YAML in either direction.",
    seoTitle: "JSON to YAML Converter - Two-Way & Free Online",
    seoDescription:
      "Convert JSON to YAML or YAML back to JSON with correct nesting and indentation. Handy for Kubernetes manifests and CI configuration.",
    keywords: ["json to yaml", "yaml to json", "yaml converter"],
    category: "developer",
    icon: "file-code",
    updated: REVISED,
  },
  {
    slug: "jwt-debugger",
    name: "JWT Debugger",
    tagline: "Decode token headers, claims and expiry locally.",
    seoTitle: "JWT Debugger - Decode JSON Web Tokens Safely Online",
    seoDescription:
      "Decode a JWT header, payload and expiry without sending it anywhere. Because decoding happens in your browser, real tokens stay private.",
    keywords: ["jwt debugger", "decode jwt", "jwt decoder", "json web token"],
    category: "developer",
    icon: "shield-check",
    updated: REVISED,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate single or bulk RFC 4122 v4 identifiers.",
    seoTitle: "UUID Generator - Bulk RFC 4122 v4 GUIDs, Free Online",
    seoDescription:
      "Generate one or thousands of RFC 4122 version 4 UUIDs using the browser's crypto API. Choose case and hyphenation, then copy or download.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid"],
    category: "developer",
    icon: "key",
    updated: REVISED,
  },
  {
    slug: "html-entities",
    name: "HTML Entities",
    tagline: "Escape and unescape HTML special characters.",
    seoTitle: "HTML Entity Encoder & Decoder - Escape HTML Online",
    seoDescription:
      "Convert characters such as <, > and & into HTML entities, or decode escaped markup back into plain text. Free and instant.",
    keywords: ["html entities", "escape html", "html encoder", "html decoder"],
    category: "developer",
    icon: "code",
    updated: REVISED,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Test patterns live with highlighted matches and groups.",
    seoTitle: "Regex Tester - Test Regular Expressions Live, Free Online",
    seoDescription:
      "Test regular expressions against sample text with highlighted matches, capture groups and flag toggles, plus a plain-English explanation.",
    keywords: ["regex tester", "regular expression tester", "regex101 alternative", "test regex"],
    category: "developer",
    icon: "regex",
    updated: REVISED,
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    tagline: "HEX, RGB and HSL with WCAG contrast checking.",
    seoTitle: "Color Converter - HEX to RGB & HSL With Contrast Check",
    seoDescription:
      "Convert colours between HEX, RGB and HSL, check WCAG contrast ratios and find the nearest Tailwind colour name. Free and instant.",
    keywords: ["hex to rgb", "color converter", "rgb to hex", "hsl converter"],
    category: "developer",
    icon: "palette",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "user-agent",
    name: "User Agent Parser",
    tagline: "Identify browser, engine, OS and device from a UA string.",
    seoTitle: "User Agent Parser - Detect Browser, OS & Device Free",
    seoDescription:
      "Paste any User-Agent string to identify the browser, version, rendering engine, operating system and device type. Free and client-side.",
    keywords: ["user agent parser", "my user agent", "browser detection", "ua string"],
    category: "developer",
    icon: "laptop",
    updated: REVISED,
  },

  // ──────────────────── Calculators & Converters ───────────────────
  {
    slug: "age-calculator",
    name: "Age Calculator",
    tagline: "Exact age in years, months, days, hours and minutes.",
    seoTitle: "Age Calculator - Find Your Exact Age in Years, Months, Days",
    seoDescription:
      "Calculate exact age from a date of birth in years, months, weeks, days, hours and minutes, plus the countdown to your next birthday.",
    keywords: ["age calculator", "calculate age", "date of birth calculator", "how old am i"],
    category: "calculators",
    icon: "calendar-days",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    tagline: "Monthly instalment, total interest and repayment breakdown.",
    seoTitle: "EMI Calculator - Home, Car & Personal Loan EMI Online",
    seoDescription:
      "Calculate the monthly EMI, total interest and total repayment for any loan. Adjust amount, rate and tenure to see the breakdown update instantly.",
    keywords: ["emi calculator", "loan calculator", "home loan emi", "car loan emi"],
    category: "calculators",
    icon: "coins",
    updated: REVISED,
    popular: true,
    trending: true,
  },
  {
    slug: "percent-calculator",
    name: "Percentage Calculator",
    tagline: "Percent of, percentage change, discounts and splits.",
    seoTitle: "Percentage Calculator - Percent Change, Increase & Discount",
    seoDescription:
      "Solve everyday percentage problems: what percent of a number, percentage increase or decrease, discount pricing and ratio splits.",
    keywords: ["percentage calculator", "percent change", "discount calculator", "percentage increase"],
    category: "calculators",
    icon: "percent",
    updated: REVISED,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Length, weight, temperature, area and speed.",
    seoTitle: "Unit Converter - Length, Weight, Temperature, Area & Speed",
    seoDescription:
      "Convert between metric and imperial units for length, weight, temperature, area and speed, with instant two-way results.",
    keywords: ["unit converter", "metric to imperial", "cm to inches", "kg to pounds"],
    category: "calculators",
    icon: "ruler",
    updated: REVISED,
  },
  {
    slug: "timezone-converter",
    name: "Time Zone Converter",
    tagline: "Compare one moment across several time zones.",
    seoTitle: "Time Zone Converter - Compare Times Across Cities Free",
    seoDescription:
      "Convert a date and time across multiple time zones at once. Useful for scheduling meetings and calls across different countries.",
    keywords: ["time zone converter", "timezone calculator", "world clock", "ist to est"],
    category: "calculators",
    icon: "clock",
    updated: REVISED,
  },

  // ────────────────────── SEO & Marketing Tools ─────────────────────
  {
    slug: "url-shortener",
    name: "URL Shortener",
    tagline: "Short links with custom slugs, expiry and click tracking.",
    seoTitle: "Free URL Shortener With Click Tracking & Custom Slugs",
    seoDescription:
      "Shorten long links, choose a custom slug, set an expiry and track clicks in real time. Free to use with no account required.",
    keywords: ["url shortener", "short link generator", "link shortener free", "custom short url"],
    category: "seo",
    icon: "link",
    updated: REVISED,
    popular: true,
    trending: true,
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    tagline: "Custom-coloured, print-ready QR codes for any link or text.",
    seoTitle: "QR Code Generator - Free Custom QR Codes, High Resolution",
    seoDescription:
      "Create QR codes for links, text, Wi-Fi and contact details. Customise colours and size, then download a print-ready PNG. Free, with no watermark.",
    keywords: ["qr code generator", "create qr code", "free qr code", "custom qr code"],
    category: "seo",
    icon: "qr-code",
    updated: REVISED,
    popular: true,
    trending: true,
  },
  {
    slug: "utm-builder",
    name: "UTM Builder",
    tagline: "Build tagged campaign URLs for analytics.",
    seoTitle: "UTM Builder - Create Campaign Tracking URLs Free",
    seoDescription:
      "Build correctly formatted UTM campaign URLs for Google Analytics. Fill in source, medium and campaign, then copy the tagged link.",
    keywords: ["utm builder", "utm generator", "campaign url builder", "utm parameters"],
    category: "seo",
    icon: "trending-up",
    updated: REVISED,
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    tagline: "Turn headlines into clean, hyphenated URL slugs.",
    seoTitle: "URL Slug Generator - Convert Titles to Clean SEO Slugs",
    seoDescription:
      "Turn any headline into a clean, lowercase, hyphenated URL slug. Strips accents, punctuation and stop words for tidier permalinks.",
    keywords: ["slug generator", "url slug", "seo slug", "permalink generator"],
    category: "seo",
    icon: "link",
    updated: REVISED,
  },
  {
    slug: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    tagline: "Grab any video's cover image in every resolution.",
    seoTitle: "YouTube Thumbnail Downloader - Grab HD Covers Free",
    seoDescription:
      "Paste a YouTube URL to download its thumbnail in every available resolution up to 1280×720 HD. Free and instant.",
    keywords: [
      "youtube thumbnail downloader",
      "download youtube thumbnail",
      "yt thumbnail grabber",
    ],
    category: "seo",
    icon: "youtube",
    updated: REVISED,
    trending: true,
  },

  // ───────────────────── Network & Security Tools ───────────────────
  {
    slug: "dns-lookup",
    name: "DNS Lookup",
    tagline: "Query A, AAAA, MX, CNAME, TXT and NS records.",
    seoTitle: "DNS Lookup Tool - Check A, MX, TXT & CNAME Records",
    seoDescription:
      "Look up A, AAAA, MX, CNAME, TXT and NS records for any domain using Cloudflare DNS over HTTPS. Free and instant.",
    keywords: ["dns lookup", "check dns records", "mx record lookup", "dns checker"],
    category: "network",
    icon: "globe",
    updated: REVISED,
  },
  {
    slug: "what-is-my-ip",
    name: "What Is My IP",
    tagline: "Your public IP, ISP and approximate location.",
    seoTitle: "What Is My IP Address - Check Your Public IP & ISP",
    seoDescription:
      "See your public IP address, approximate location, ISP and connection details instantly. Supports both IPv4 and IPv6.",
    keywords: ["what is my ip", "my ip address", "check ip", "public ip lookup"],
    category: "network",
    icon: "eye",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Cryptographically random passwords with a strength meter.",
    seoTitle: "Strong Password Generator - Secure Random Passwords Free",
    seoDescription:
      "Generate strong random passwords using the browser's cryptographic RNG. Control length, symbols and numbers, with a live strength meter.",
    keywords: [
      "password generator",
      "strong password generator",
      "random password",
      "secure password",
    ],
    category: "network",
    icon: "lock",
    updated: REVISED,
    popular: true,
  },
];

/** @deprecated Prefer `TOOLS`. Retained so older imports keep compiling. */
export const ALL_TOOLS = TOOLS;

const TOOL_BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

export function toolUrl(tool: Pick<Tool, "slug">): string {
  return `/${tool.slug}`;
}

export function getTool(slug: string): Tool | undefined {
  return TOOL_BY_SLUG.get(slug);
}

/** Look up a tool from a pathname such as "/qr-generator". */
export function getToolByPath(pathname: string): Tool | undefined {
  return TOOL_BY_SLUG.get(pathname.replace(/^\/+|\/+$/g, ""));
}

export function toolsInCategory(category: CategorySlug): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

/**
 * Sibling tools used for the "Related tools" block. Falls back to popular
 * tools from other categories when a category is too small to fill the row.
 */
export function relatedTools(slug: string, limit = 3): Tool[] {
  const tool = TOOL_BY_SLUG.get(slug);
  if (!tool) return [];

  const siblings = TOOLS.filter((t) => t.category === tool.category && t.slug !== slug);
  if (siblings.length >= limit) return siblings.slice(0, limit);

  const filler = TOOLS.filter(
    (t) => t.category !== tool.category && t.popular && t.slug !== slug,
  );
  return [...siblings, ...filler].slice(0, limit);
}

export const POPULAR_TOOLS = TOOLS.filter((t) => t.popular);
export const TRENDING_TOOLS = TOOLS.filter((t) => t.trending);
export const NEW_TOOLS = TOOLS.filter((t) => t.isNew);
