import {
  Link2,
  Calculator,
  FileSpreadsheet,
  QrCode,
  Lock,
  Code2,
  FileImage,
  FileText,
  Scale,
  Globe,
  Youtube,
  Settings
} from "lucide-react";

export interface ToolItem {
  name: string;
  url: string;
  description: string;
  category: "Calculators" | "Image Tools" | "PDF Tools" | "Developer Tools" | "SEO Tools" | "Social Tools" | "Text Tools" | "Utility Tools";
  icon: React.ComponentType<{ className?: string }>;
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

export const ALL_TOOLS: ToolItem[] = [
  {
    name: "Free URL Shortener",
    url: "/url-shortener",
    description: "Shorten long tracking links, generate QR codes, and view click metrics in real-time.",
    category: "Developer Tools",
    icon: Link2,
    isPopular: true,
    isTrending: true,
  },
  {
    name: "Age Calculator",
    url: "/age-calculator",
    description: "Determine exact age in years, months, weeks, days, and minutes with target milestones.",
    category: "Calculators",
    icon: Calculator,
    isPopular: true,
  },
  {
    name: "Loan EMI Calculator",
    url: "/emi-calculator",
    description: "Calculate monthly loan EMIs, interest payable, and total costs with payment ratio charts.",
    category: "Calculators",
    icon: FileSpreadsheet,
    isPopular: true,
    isNew: true,
  },
  {
    name: "QR Code Generator",
    url: "/qr-generator",
    description: "Create fully styled, high-res QR codes for URLs, text, Wi-Fi details, and contacts.",
    category: "Developer Tools",
    icon: QrCode,
    isPopular: true,
    isTrending: true,
  },
  {
    name: "Secure Password Generator",
    url: "/password-generator",
    description: "Generate highly secure, cryptographically random passkeys with customizable options.",
    category: "Developer Tools",
    icon: Lock,
    isNew: true,
  },
  {
    name: "JSON Formatter & Validator",
    url: "/json-formatter",
    description: "Format, minify, and lint check JSON payloads with local browser validation.",
    category: "Developer Tools",
    icon: Code2,
    isPopular: false,
  },
  {
    name: "Base64 Encoder & Decoder",
    url: "/base64",
    description: "Encode raw text strings to Base64 format and decode Base64 strings back to text.",
    category: "Developer Tools",
    icon: Code2,
    isNew: true,
  },
  {
    name: "Image Compressor",
    url: "/image-compressor",
    description: "Reduce image file sizes instantly while preserving quality using client-side canvas parsing.",
    category: "Image Tools",
    icon: FileImage,
    isPopular: true,
    isTrending: true,
  },
  {
    name: "JPG to WebP Converter",
    url: "/jpg-to-webp",
    description: "Convert JPG and PNG images into modern, highly compressed WebP files to speed up web loading.",
    category: "Image Tools",
    icon: FileImage,
    isTrending: false,
    isNew: true,
  },
  {
    name: "Merge PDF Files Online",
    url: "/pdf-merge",
    description: "Combine multiple PDF documents into a single file. Drag, reorder, and merge client-side.",
    category: "PDF Tools",
    icon: FileText,
    isPopular: false,
    isNew: true,
  },
  {
    name: "Multi-Unit Converter",
    url: "/unit-converter",
    description: "Convert metrics across Length, Weight, Temperature, Area, and Speed in real-time.",
    category: "Utility Tools",
    icon: Scale,
    isNew: true,
  },
  {
    name: "Time zone Converter",
    url: "/timezone-converter",
    description: "Compare and translate dates and times across major global timezones simultaneously.",
    category: "Utility Tools",
    icon: Globe,
    isNew: true,
  },
  {
    name: "Word Counter",
    url: "/word-counter",
    description: "Check word counts, character lengths, sentences, paragraphs, reading speed, and densities.",
    category: "Text Tools",
    icon: FileText,
    isNew: true,
  },
  {
    name: "Character Counter",
    url: "/character-counter",
    description: "Calculate total characters with and without spaces, check lines, letters, numbers, and densities.",
    category: "Text Tools",
    icon: FileText,
  },
  {
    name: "YouTube Thumbnail Downloader",
    url: "/youtube-thumbnail",
    description: "Extract static preview and high-resolution thumbnail images from any YouTube URL.",
    category: "Social Tools",
    icon: Youtube,
    isTrending: true,
  },
  {
    name: "UTM Campaign URL Builder",
    url: "/utm-builder",
    description: "Build campaign URLs with Google Analytics tracking tags to analyze promotion sources.",
    category: "SEO Tools",
    icon: Settings,
    isTrending: false,
  },
];
