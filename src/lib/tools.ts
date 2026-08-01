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
  /**
   * Where the work happens.
   *
   * "local"   — everything runs in the browser; the input never leaves the device.
   * "network" — the input is sent to a server (ours or a third party's).
   *
   * This drives the trust badges on the tool page. Most of the site is local,
   * and that claim is a big part of why people use it — so a tool that does
   * make a network call must say so rather than inherit the reassurance.
   * Defaults to "local" when omitted.
   */
  processing?: "local" | "network";
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
  {
    slug: "pdf-organizer",
    name: "Organise PDF",
    tagline: "Drag, drop, and rearrange pages of your PDF document visually.",
    seoTitle: "Organise PDF Pages - Rearrange PDF Free Online",
    seoDescription:
      "Rearrange and reorder pages in your PDF visually. Drag and drop thumbnails to organize pages before exporting. 100% client-side.",
    keywords: ["organize pdf", "rearrange pdf pages", "reorder pdf online", "pdf page organizer"],
    category: "pdf",
    icon: "layers",
    updated: REVISED,
  },
  {
    slug: "pdf-page-deleter",
    name: "Delete PDF Pages",
    tagline: "Remove selected pages from a PDF document visually.",
    seoTitle: "Delete PDF Pages - Remove Pages from PDF Online Free",
    seoDescription:
      "Select and remove unwanted pages from your PDF visually. Delete even, odd, or custom pages and download a clean PDF. 100% client-side.",
    keywords: ["delete pdf pages", "remove pages from pdf", "pdf page deleter", "remove pdf page free"],
    category: "pdf",
    icon: "scissors",
    updated: REVISED,
  },
  {
    slug: "pdf-watermark",
    name: "Add PDF Watermark",
    tagline: "Overlay text watermarks onto PDF pages with custom styles.",
    seoTitle: "Add Watermark to PDF - Add PDF Watermark Free Online",
    seoDescription:
      "Add custom text watermarks to your PDF pages. Adjust font size, color, rotation angle, opacity, and positioning. 100% client-side.",
    keywords: ["add pdf watermark", "watermark pdf online", "add watermark to pdf", "pdf watermark creator"],
    category: "pdf",
    icon: "file-text",
    updated: REVISED,
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    tagline: "Extract clean, editable text content from PDF pages client-side.",
    seoTitle: "PDF to Text Converter - Extract Text from PDF Online Free",
    seoDescription:
      "Convert PDF to text and extract clean, editable text content page-by-page. Runs completely in your browser using secure client-side parsing.",
    keywords: ["pdf to text", "extract text from pdf", "convert pdf to txt", "pdf text extractor"],
    category: "pdf",
    icon: "type",
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
    slug: "png-to-jpg",
    name: "PNG to JPG",
    tagline: "Convert PNG images to JPG format client-side.",
    seoTitle: "PNG to JPG Converter - Convert PNG to JPG Free Online",
    seoDescription:
      "Convert PNG images into high-quality JPG format in your browser. Replaces transparent pixels with a solid white background, completely client-side.",
    keywords: ["png to jpg", "convert png to jpg", "png to jpeg", "convert png to jpeg"],
    category: "image",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "png-to-webp",
    name: "PNG to WebP",
    tagline: "Convert PNG images to WebP format to save size.",
    seoTitle: "PNG to WebP Converter - Convert PNG to WebP Free Online",
    seoDescription:
      "Convert PNG images into lightweight WebP format. Preserves alpha channel transparency while reducing file size, 100% client-side.",
    keywords: ["png to webp", "convert png to webp", "png to webp transparency"],
    category: "image",
    icon: "file-image",
    updated: REVISED,
  },
  {
    slug: "png-to-bmp",
    name: "PNG to BMP",
    tagline: "Convert PNG images to BMP bitmap format.",
    seoTitle: "PNG to BMP Converter - Convert PNG to BMP Free Online",
    seoDescription:
      "Convert PNG images to uncompressed or standard BMP bitmap format. Runs locally in your browser with no file uploads.",
    keywords: ["png to bmp", "convert png to bmp", "png to bitmap"],
    category: "image",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    tagline: "Convert JPG images to lossless PNG format.",
    seoTitle: "JPG to PNG Converter - Convert JPG to PNG Free Online",
    seoDescription:
      "Convert JPG images to lossless PNG format. Instant, free, and processed entirely in your browser with no quality loss.",
    keywords: ["jpg to png", "convert jpg to png", "jpeg to png"],
    category: "image",
    icon: "file-image",
    updated: REVISED,
  },
  {
    slug: "jpg-to-bmp",
    name: "JPG to BMP",
    tagline: "Convert JPG images to BMP bitmap format.",
    seoTitle: "JPG to BMP Converter - Convert JPG to BMP Free Online",
    seoDescription:
      "Convert JPG images to standard BMP bitmap format. Free, instant, and processed locally inside your browser.",
    keywords: ["jpg to bmp", "convert jpg to bmp", "jpeg to bmp"],
    category: "image",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG",
    tagline: "Convert WebP images to standard JPG format.",
    seoTitle: "WebP to JPG Converter - Convert WebP to JPG Free Online",
    seoDescription:
      "Convert modern WebP images to standard JPG format for maximum device compatibility. Runs entirely in your browser.",
    keywords: ["webp to jpg", "convert webp to jpg", "webp to jpeg"],
    category: "image",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG",
    tagline: "Convert WebP images to lossless PNG format.",
    seoTitle: "WebP to PNG Converter - Convert WebP to PNG Free Online",
    seoDescription:
      "Convert WebP images to lossless PNG format to preserve transparency and detail. Free, instant, and client-side.",
    keywords: ["webp to png", "convert webp to png", "webp to png transparency"],
    category: "image",
    icon: "file-image",
    updated: REVISED,
  },
  {
    slug: "webp-to-bmp",
    name: "WebP to BMP",
    tagline: "Convert WebP images to BMP bitmap format.",
    seoTitle: "WebP to BMP Converter - Convert WebP to BMP Free Online",
    seoDescription:
      "Convert WebP images to BMP bitmap format easily. High fidelity conversion processed locally in your browser.",
    keywords: ["webp to bmp", "convert webp to bmp"],
    category: "image",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "bmp-to-jpg",
    name: "BMP to JPG",
    tagline: "Convert BMP images to standard compressed JPG format.",
    seoTitle: "BMP to JPG Converter - Convert BMP to JPG Free Online",
    seoDescription:
      "Convert large BMP bitmap images into compressed JPG format to save storage and web bandwidth. Done locally in your browser.",
    keywords: ["bmp to jpg", "convert bmp to jpg", "bitmap to jpeg"],
    category: "image",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "bmp-to-png",
    name: "BMP to PNG",
    tagline: "Convert BMP images to lossless PNG format.",
    seoTitle: "BMP to PNG Converter - Convert BMP to PNG Free Online",
    seoDescription:
      "Convert BMP bitmap images to lossless PNG format. Free, instant, and processed 100% locally inside your browser.",
    keywords: ["bmp to png", "convert bmp to png", "bitmap to png"],
    category: "image",
    icon: "file-image",
    updated: REVISED,
  },
  {
    slug: "bmp-to-webp",
    name: "BMP to WebP",
    tagline: "Convert BMP images to modern WebP format.",
    seoTitle: "BMP to WebP Converter - Convert BMP to WebP Free Online",
    seoDescription:
      "Convert large BMP bitmap images to modern, highly compressed WebP format for fast web rendering. 100% client-side.",
    keywords: ["bmp to webp", "convert bmp to webp", "bitmap to webp"],
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
  {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Crop and resize images to custom dimensions client-side.",
    seoTitle: "Image Resizer & Cropper - Resize & Crop Images Free Online",
    seoDescription:
      "Crop and resize images to custom pixel dimensions or preset aspect ratios locally in your browser. Supports JPG, PNG, and WebP formats.",
    keywords: ["image resizer", "crop image online", "resize image pixels", "image cropper free"],
    category: "image",
    icon: "shrink",
    updated: REVISED,
  },
  {
    slug: "exif-viewer",
    name: "EXIF Viewer & Stripper",
    tagline: "Inspect JPEG camera metadata and strip it for privacy.",
    seoTitle: "EXIF Metadata Viewer & Stripper - Remove Image Metadata Online",
    seoDescription:
      "Read JPEG metadata (camera, exposure, location) and strip all EXIF profiles from your photos to protect your privacy. 100% client-side.",
    keywords: ["exif viewer", "strip exif metadata", "remove image metadata", "view gps coordinates photo"],
    category: "image",
    icon: "eye",
    updated: REVISED,
  },
  {
    slug: "meme-generator",
    name: "Meme Generator",
    tagline: "Create custom memes with text captions instantly.",
    seoTitle: "Meme Generator - Create Custom Memes Free Online",
    seoDescription:
      "Generate custom memes by uploading your own images and overlays. Adjust text parameters (Impact font styles, white/black borders) entirely in your browser.",
    keywords: ["meme generator", "make a meme online", "custom meme maker", "free meme creator"],
    category: "image",
    icon: "palette",
    updated: REVISED,
  },
  {
    slug: "pixel-art-generator",
    name: "Pixel Art Converter",
    tagline: "Turn standard photos into retro 8-bit/16-bit pixel art.",
    seoTitle: "Pixel Art Converter - Pixelate Images Free Online",
    seoDescription:
      "Convert your photos into retro pixel art. Adjust block sizing, constrain color palettes, and toggle grid grids locally inside your browser.",
    keywords: ["pixel art generator", "pixelate image online", "8 bit photo converter", "retro pixel editor"],
    category: "image",
    icon: "layers",
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
    category: "developer",
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
  {
    slug: "text-find-replace",
    name: "Text Find & Replace",
    tagline: "Search and replace text with case-sensitive and regex matching.",
    seoTitle: "Text Find & Replace - Advanced String Replacer Free Online",
    seoDescription:
      "Find and replace text fragments. Supports case-sensitivity toggles, match count summaries, custom replacement lists, and regular expressions with live highlights. 100% client-side.",
    keywords: ["text find and replace", "search and replace text", "replace word in text", "regex replace online"],
    category: "text",
    icon: "replace",
    updated: REVISED,
  },
  {
    slug: "random-name-picker",
    name: "Random Name Picker",
    tagline: "Pick a random winner from a list of names with slot animations.",
    seoTitle: "Random Name Picker - Giveaway & Name Draw Wheel Online",
    seoDescription:
      "Input a list of names or custom choices to draw random winners. Features customizable winner counts and a premium slot-machine cycle animation. 100% client-side.",
    keywords: ["name picker", "random name picker", "draw a winner", "giveaway picker online", "slot machine name picker"],
    category: "text",
    icon: "palette",
    updated: REVISED,
  },
  {
    slug: "list-sorter-deduplicator",
    name: "List Sorter & Deduplicator",
    tagline: "Remove duplicate entries, trim rows, and sort lists.",
    seoTitle: "List Sorter & Deduplicator - Clean, Sort and Deduplicate Lines",
    seoDescription:
      "Deduplicate text rows, trim whitespace, filter empty lines, and sort entries alphabetically, numerically, or by line length. 100% client-side.",
    keywords: ["list deduplicator", "sort list online", "remove duplicate lines", "alphabetize list"],
    category: "text",
    icon: "align-left",
    updated: REVISED,
  },
  {
    slug: "morse-code-translator",
    name: "Morse Code Translator",
    tagline: "Translate text to Morse or binary and play beeps.",
    seoTitle: "Morse Code Translator & Audio Player - Text to Morse/Binary",
    seoDescription:
      "Convert text to Morse code or binary strings and vice versa. Plays audio beeps for Morse code using Web Audio oscillators. 100% client-side.",
    keywords: ["morse code translator", "text to morse", "morse code audio", "text to binary translator"],
    category: "text",
    icon: "binary",
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
    category: "text",
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
  {
    slug: "html-css-beautifier-minifier",
    name: "HTML/CSS Formatter",
    tagline: "Beautify or minify HTML markup and CSS stylesheets.",
    seoTitle: "HTML/CSS Beautifier & Minifier - Clean or Compress Code Free",
    seoDescription:
      "Format messy HTML and CSS with clean indentation, or minify them into single-line strings to compress file size. 100% client-side.",
    keywords: ["html beautifier", "css minifier", "html formatter", "minify css", "beautify html css"],
    category: "developer",
    icon: "code",
    updated: REVISED,
  },
  {
    slug: "epoch-converter",
    name: "Epoch Converter",
    tagline: "Convert Unix timestamps to date-times and back in real-time.",
    seoTitle: "Unix Timestamp Epoch Converter - Convert Epoch to Date Online",
    seoDescription:
      "Convert integer Unix timestamps (seconds or milliseconds) to readable ISO-8601, UTC, and local date-times, or encode date formats back to epoch. 100% client-side.",
    keywords: ["epoch converter", "unix timestamp converter", "convert epoch to date", "current unix timestamp"],
    category: "developer",
    icon: "clock",
    updated: REVISED,
  },
  {
    slug: "cron-generator",
    name: "Cron Helper",
    tagline: "Visual scheduler editor that generates valid Unix cron syntax.",
    seoTitle: "Cron Expression Generator & Helper - Visual Cron Builder",
    seoDescription:
      "Generate standard 5-field cron expressions visually. Select schedules, read human explanations, and preview next execution dates in your browser.",
    keywords: ["cron generator", "cron builder", "cron helper", "generate cron expression"],
    category: "developer",
    icon: "calendar-days",
    updated: REVISED,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    tagline: "Compute SHA-256, MD5, SHA-512, or SHA-1 hashes of texts and files.",
    seoTitle: "Online Hash Generator - Compute SHA-256, MD5, SHA-512, SHA-1",
    seoDescription:
      "Calculate secure cryptographic checksums (SHA-256, MD5, SHA-512, SHA-1) of plain text or binary files locally in your browser. Files are never uploaded.",
    keywords: ["hash generator", "sha256 online", "md5 generator", "sha512 checksum file"],
    category: "developer",
    icon: "shield-check",
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
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    tagline: "Simulate Mutual Fund Systematic Investment Plans with growth projections.",
    seoTitle: "SIP Calculator - Mutual Fund Systematic Investment Plan Planner",
    seoDescription:
      "Calculate your Mutual Fund SIP wealth gained and future maturity amount. View detailed yearly growth projection tables and custom SVG compound growth charts.",
    keywords: ["sip calculator", "mutual fund calculator", "sip investment planner", "wealth gain calculator"],
    category: "calculators",
    icon: "coins",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "bmr-tdee-calculator",
    name: "Calorie & TDEE Calculator",
    tagline: "Calculate Basal Metabolic Rate and Daily Calorie Targets.",
    seoTitle: "Calorie & TDEE Calculator - BMR, Weight Loss & Macro Planner",
    seoDescription:
      "Find your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Get calorie and macronutrient targets for weight loss or muscle building.",
    keywords: ["bmr calculator", "tdee calculator", "calorie calculator", "macro calculator", "mifflin st jeor"],
    category: "calculators",
    icon: "calculator",
    updated: REVISED,
  },
  {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    tagline: "Track purchasing power changes and historical value depreciation.",
    seoTitle: "Inflation Calculator - Compute Buying Power Loss Over Time",
    seoDescription:
      "Calculate compound inflation, purchasing power loss, and future adjusted values over years with customized average rates and SVG charts.",
    keywords: ["inflation calculator", "purchasing power calculator", "buying power loss", "compound inflation calculator"],
    category: "calculators",
    icon: "trending-up",
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
    // Stores the destination URL in our database.
    processing: "network",
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
    slug: "robots-txt-generator",
    name: "Robots.txt Builder",
    tagline: "Generate standardized robots.txt files for search engine crawlers.",
    seoTitle: "Robots.txt Generator - Create Standard Robots Rules Online",
    seoDescription:
      "Build robots.txt configuration instructions visually. Control user-agents (Googlebot, Bingbot), specify disallow directories, and link XML sitemaps.",
    keywords: ["robots txt generator", "robots txt builder", "create robots txt online", "crawling rules checker"],
    category: "seo",
    icon: "file-code",
    updated: REVISED,
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    tagline: "Generate title tags, meta descriptions, and Open Graph cards.",
    seoTitle: "HTML Meta Tag Generator - Title, Description, OG & Twitter",
    seoDescription:
      "Generate HTML meta tags for title, description, keywords, Open Graph, and Twitter Cards with search card mockup previews. 100% client-side.",
    keywords: ["meta tag generator", "og tags creator", "twitter card generator", "google snippet simulator"],
    category: "seo",
    icon: "eye",
    updated: REVISED,
  },
  {
    slug: "keyword-density-analyzer",
    name: "Keyword Density Checker",
    tagline: "Scan text to calculate keyword occurrence ratios.",
    seoTitle: "Keyword Density Checker - Scan Text for Keyword Stuffing",
    seoDescription:
      "Analyze keyword density of copy. Scan frequencies of 1-word, 2-word, and 3-word phrases to prevent search engine keyword stuffing. 100% client-side.",
    keywords: ["keyword density checker", "keyword analyzer", "seo keyword density online", "prevent keyword stuffing"],
    category: "seo",
    icon: "align-left",
    updated: REVISED,
  },
  // ────────────────────── Social & Downloads ───────────────────────
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
    // Moved out of SEO & Marketing: it's a media downloader, which is what
    // people searching for it expect it to sit beside.
    category: "social",
    icon: "youtube",
    // Loads thumbnail images from YouTube's servers.
    processing: "network",
    updated: REVISED,
    trending: true,
  },
  {
    slug: "instagram-reel-downloader",
    name: "Instagram Reel Downloader",
    tagline: "Save public Instagram reels and videos in HD.",
    seoTitle: "Instagram Reel Downloader — Save Reels in HD, Free",
    seoDescription:
      "Paste a public Instagram reel link to download the video in HD, with no watermark and no signup. Works for reels, video posts and IGTV.",
    keywords: [
      "instagram reel downloader",
      "download instagram reels",
      "instagram video downloader",
      "save instagram reel",
      "insta reel download",
    ],
    category: "social",
    icon: "instagram",
    // Sends the link to our downloader service.
    processing: "network",
    updated: REVISED,
    popular: true,
    trending: true,
    isNew: true,
  },
  {
    slug: "facebook-reel-downloader",
    name: "Facebook Reel Downloader",
    tagline: "Save public Facebook reels and videos in HD.",
    seoTitle: "Facebook Reel Downloader — Save FB Reels & Videos Free",
    seoDescription:
      "Paste a public Facebook reel or video link to download it in HD. Free, no watermark and no signup. Supports facebook.com and fb.watch links.",
    keywords: [
      "facebook reel downloader",
      "download facebook reels",
      "fb video downloader",
      "facebook video download",
      "fb watch downloader",
    ],
    category: "social",
    icon: "facebook",
    // Sends the link to our downloader service.
    processing: "network",
    updated: REVISED,
    popular: true,
    trending: true,
    isNew: true,
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
    // Queries Cloudflare DNS over HTTPS from your browser.
    processing: "network",
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
    // Queries a public IP lookup service from your browser.
    processing: "network",
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
  {
    slug: "ip-subnet-calculator",
    name: "IP Subnet CIDR Calculator",
    tagline: "Decode CIDR prefixes into IP boundaries and network ranges.",
    seoTitle: "IP Subnet CIDR Calculator - IP Network Range Planner",
    seoDescription:
      "Calculate IP subnet parameters. Decode CIDR notations to netmasks, broadcast addresses, usable IP scopes, and host capacities in binary and decimal format.",
    keywords: ["subnet calculator", "cidr calculator", "ip subnet calculator", "ip range finder"],
    category: "network",
    icon: "globe",
    updated: REVISED,
  },
  {
    slug: "passphrase-generator",
    name: "Passphrase Generator",
    tagline: "Generate memorable, cryptographically secure passwords.",
    seoTitle: "Strong Passphrase Generator - Memorably Secure Passwords",
    seoDescription:
      "Generate cryptographically secure, memorable passphrases using local terms and browser cryptographic RNG. Fully customizable. 100% client-side.",
    keywords: ["passphrase generator", "secure passphrase generator", "correct horse battery staple", "memorable password"],
    category: "network",
    icon: "lock",
    updated: REVISED,
    popular: true,
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    tagline: "Build linear and radial gradients with customizable color stops.",
    seoTitle: "CSS Gradient Generator - Visual Gradient Editor & CSS Export",
    seoDescription:
      "Design CSS gradients visually. Supports linear and radial modes, direction angles, multi-color stops, and outputs clean copyable CSS rules.",
    keywords: ["css gradient generator", "gradient editor online", "linear gradient css", "radial gradient maker"],
    category: "design",
    icon: "palette",
    updated: REVISED,
  },
  {
    slug: "css-box-shadow-generator",
    name: "CSS Box-Shadow Generator",
    tagline: "Design layered box-shadow styles with live previews.",
    seoTitle: "CSS Box-Shadow Generator - Visual Shadow Customizer & Stacker",
    seoDescription:
      "Generate custom CSS box shadows. Adjust blur, spread, offsets, and opacity. Supports stacking multiple shadow layers with real-time browser preview.",
    keywords: ["box shadow generator", "css shadow maker", "layered shadows", "figma box shadow css"],
    category: "design",
    icon: "layers",
    updated: REVISED,
  },
  {
    slug: "image-palette-extractor",
    name: "Image Palette Extractor",
    tagline: "Extract dominant color palettes from uploaded images.",
    seoTitle: "Image Color Palette Extractor - Get Colors from Images Online",
    seoDescription:
      "Upload PNG, JPG, or WebP images to extract dominant color schemes. Uses HTML5 canvas quantization to output HEX, RGB, and HSL palettes.",
    keywords: ["image palette extractor", "color grabber from image", "extract colors online", "hex code from photo"],
    category: "design",
    icon: "image",
    updated: REVISED,
  },
  {
    slug: "border-radius-previewer",
    name: "Border Radius Previewer",
    tagline: "Generate standard and 8-point organic border-radius values.",
    seoTitle: "Border Radius Previewer - Organic Border Shapes Generator",
    seoDescription:
      "Preview CSS border-radius rules. Supports standard corner sliders and advanced 8-point organic boundary settings with live morphing shapes.",
    keywords: ["border radius generator", "organic border radius css", "8 point border radius", "css shape morpher"],
    category: "design",
    icon: "shrink",
    updated: REVISED,
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    tagline: "Instantly encode or decode text strings for URL parameters.",
    seoTitle: "URL Encoder & Decoder - Percent Encoding Online Free",
    seoDescription:
      "Encode characters for URL safety using percent-encoding or decode URL-encoded text. Supports URI and URI Component modes. 100% client-side.",
    keywords: ["url encoder", "url decoder", "percent encoding", "decode url string"],
    category: "developer",
    icon: "arrow-left-right",
    updated: REVISED,
  },
  {
    slug: "base64-file-converter",
    name: "Base64 File Converter",
    tagline: "Encode any file to Base64 data URL, or decode Base64 back to files.",
    seoTitle: "Base64 File Converter - Encode & Decode Files Online Free",
    seoDescription:
      "Upload images, PDFs, zip archives, or documents to encode them into Base64 data URLs. Paste Base64 code to decode back into downloadable files.",
    keywords: ["base64 file converter", "file to base64", "base64 decoder to file", "data url generator"],
    category: "developer",
    icon: "binary",
    updated: REVISED,
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    tagline: "Simulate future growth with custom interest rates and compounding intervals.",
    seoTitle: "Compound Interest Calculator - Future Value Growth Simulator",
    seoDescription:
      "Calculate compound interest returns on investments. Supports custom annual/monthly contributions, interest rates, compounding frequencies, and SVG growth charts.",
    keywords: ["compound interest calculator", "future value simulator", "compound growth calculator", "savings calculator"],
    category: "calculators",
    icon: "calculator",
    updated: REVISED,
  },
  {
    slug: "roi-calculator",
    name: "ROI Calculator",
    tagline: "Calculate returns and annualized growth (CAGR) on investments.",
    seoTitle: "ROI Calculator - Return on Investment & CAGR Calculator",
    seoDescription:
      "Compute total profit, simple return on investment (ROI) percentage, and annualized ROI (CAGR) on assets, stocks, or property. 100% client-side.",
    keywords: ["roi calculator", "return on investment calculator", "cagr calculator", "investment return"],
    category: "calculators",
    icon: "coins",
    updated: REVISED,
  },
  {
    slug: "salary-calculator",
    name: "Salary & Take-Home Calculator",
    tagline: "Estimate net take-home salary after taxes and standard deductions.",
    seoTitle: "Salary & Take-Home Calculator - Net Pay Tax Estimator",
    seoDescription:
      "Compute your net take-home salary. Estimate income tax brackets, standard deductions, and pay period breakdowns with interactive SVG charts.",
    keywords: ["salary calculator", "take home pay calculator", "tax estimator", "net pay calculator"],
    category: "calculators",
    icon: "calculator",
    updated: REVISED,
  },
  {
    slug: "string-randomizer",
    name: "String Randomizer & Generator",
    tagline: "Generate bulk random string patterns and password keys.",
    seoTitle: "String Randomizer & Generator - Bulk Password Maker",
    seoDescription:
      "Generate multiple random string patterns. Customize character sets (alpha, numeric, symbols), length, and exclude ambiguous characters locally.",
    keywords: ["string randomizer", "random string generator", "password maker online", "api key generator"],
    category: "text",
    icon: "key",
    updated: REVISED,
  },
  {
    slug: "mac-address-lookup",
    name: "MAC Address Lookup",
    tagline: "Lookup hardware details and identify manufacturer vendors offline.",
    seoTitle: "MAC Address Lookup - Offline Vendor OUI Decoder",
    seoDescription:
      "Decode any MAC hardware address to identify OUI details, unicast/multicast types, and manufacture vendors securely in your browser.",
    keywords: ["mac address lookup", "oui lookup", "mac vendor lookup", "oui decoder"],
    category: "network",
    icon: "laptop",
    updated: REVISED,
  },
  {
    slug: "port-scanner",
    name: "Port Scanner & Check Utility",
    tagline: "Explore common service ports, vulnerabilities, and run a scan simulation.",
    seoTitle: "Port Scanner & Service Vulnerabilities Check Utility",
    seoDescription:
      "Learn about common TCP/UDP ports, scan methods, and run an interactive local port scanner simulator securely client-side.",
    keywords: ["port scanner", "port checker", "common ports list", "port vulnerabilities"],
    category: "network",
    icon: "shield",
    updated: REVISED,
  },
  {
    slug: "password-strength",
    name: "Secure Password Strength Tester",
    tagline: "Evaluate password strength using entropy calculations and crack timers.",
    seoTitle: "Password Strength Tester - Cryptographic Entropy Calculator",
    seoDescription:
      "Check your password strength using real-time entropy scoring and GPU brute-force timelines without sending passwords online.",
    keywords: ["password strength tester", "password entropy calculator", "password checker", "brute force timer"],
    category: "network",
    icon: "lock",
    updated: REVISED,
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
