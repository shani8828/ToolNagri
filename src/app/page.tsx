"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calculator,
  QrCode,
  Lock,
  Code2,
  FileImage,
  FileText,
  Youtube,
  Link2,
  Settings,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  DollarSign,
  Info,
  FileSpreadsheet,
  Scale,
  Globe
} from "lucide-react";

interface ToolItem {
  name: string;
  url: string;
  description: string;
  category: "Calculators" | "Image Tools" | "PDF Tools" | "Developer Tools" | "SEO Tools" | "Social Tools" | "Text Tools" | "Utility Tools";
  icon: React.ComponentType<{ className?: string }>;
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

const ALL_TOOLS: ToolItem[] = [
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

const CATEGORIES = [
  "All",
  "Calculators",
  "Image Tools",
  "PDF Tools",
  "Developer Tools",
  "Text Tools",
  "Utility Tools",
  "SEO Tools",
  "Social Tools",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter tools based on search and category
  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const popularTools = ALL_TOOLS.filter((t) => t.isPopular);
  const trendingTools = ALL_TOOLS.filter((t) => t.isTrending);
  const newTools = ALL_TOOLS.filter((t) => t.isNew);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,var(--color-accent-light)/10,transparent_50%)] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        
        {/* SECTION 1: Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20">
            Platform by Ayodhya Serenity
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-primary-text leading-none">
            What would you like to do today?
          </h1>
          <p className="text-base sm:text-lg text-secondary-text max-w-xl mx-auto leading-relaxed">
            Free, premium online tools engineered to process 100% locally in your browser. Speed up workflows securely with zero conversions limit.
          </p>
        </motion.div>

        {/* SECTION 2: Search and Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-2xl mx-auto space-y-6"
          id="search"
        >
          {/* Search bar */}
          <div className="relative rounded-2xl shadow-premium border border-border-color bg-white p-1.5 flex items-center gap-2">
            <div className="pl-3.5 text-secondary-text">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools... (Press Ctrl+K)"
              className="w-full py-3 bg-transparent text-primary-text placeholder-secondary-text focus:outline-none text-sm md:text-base font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold hover:text-primary-text text-secondary-text px-3 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5" id="categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary-text text-white shadow-sm"
                    : "border border-border-color bg-background text-secondary-text hover:bg-hover-bg hover:text-primary-text"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Grid Results */}
        <div className="space-y-6">
          {searchQuery || selectedCategory !== "All" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-primary-text">
                  Search Results ({filteredTools.length})
                </h2>
              </div>
              
              {filteredTools.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-color p-12 text-center text-sm text-secondary-text bg-secondary-bg/50">
                  <Info className="h-8 w-8 text-secondary-text/30 mx-auto mb-3" />
                  <p className="font-semibold text-primary-text">No tools found matching your criteria</p>
                  <p className="text-xs mt-1">Try entering another keyword or clearing category filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        href={tool.url}
                        className="group flex flex-col justify-between p-6 rounded-2xl border border-border-color bg-card-bg shadow-card hover:shadow-card-hover hover:border-accent/40 transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                            <Icon className="h-5 w-5" />
                          </span>
                          <h3 className="font-heading text-lg font-bold text-primary-text group-hover:text-accent transition-colors flex items-center gap-1.5">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-secondary-text leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-5 pt-3 border-t border-border-color/40 flex items-center justify-between text-xs font-semibold text-secondary-text group-hover:text-accent">
                          <span className="bg-secondary-bg px-2.5 py-0.5 rounded-full border border-border-color/30">
                            {tool.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            Launch Tool <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* SECTION 3: Standard Page Layout (Curated Sections) */
            <div className="space-y-16">
              
              {/* Popular Tools */}
              <div className="space-y-6" id="popular">
                <div className="flex items-center gap-2 border-b border-border-color/60 pb-3">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <h2 className="font-heading text-2xl font-bold text-primary-text">Popular Utilities</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        href={tool.url}
                        className="group flex flex-col justify-between p-5 rounded-xl border border-border-color bg-card-bg shadow-card hover:shadow-card-hover hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="space-y-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          <h3 className="font-heading text-base font-bold text-primary-text group-hover:text-accent transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-secondary-text leading-relaxed line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border-color/40 flex items-center justify-between text-[11px] font-semibold text-secondary-text">
                          <span className="bg-secondary-bg px-2 py-0.5 rounded-full">
                            {tool.category}
                          </span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform group-hover:text-accent" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Grid split for Trending & New */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Trending Tools */}
                <div className="space-y-6" id="trending">
                  <div className="flex items-center gap-2 border-b border-border-color/60 pb-3">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <h2 className="font-heading text-xl font-bold text-primary-text">Trending This Week</h2>
                  </div>
                  <div className="space-y-4">
                    {trendingTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.name}
                          href={tool.url}
                          className="group flex items-center gap-4 p-4 rounded-xl border border-border-color bg-card-bg hover:bg-hover-bg/30 transition-colors duration-200"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-bg group-hover:bg-accent/10 group-hover:text-accent text-secondary-text shrink-0 transition-colors">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading text-sm font-semibold text-primary-text group-hover:text-accent transition-colors truncate">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-secondary-text truncate mt-0.5">{tool.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-secondary-text/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* New Tools */}
                <div className="space-y-6" id="new">
                  <div className="flex items-center gap-2 border-b border-border-color/60 pb-3">
                    <Clock className="h-5 w-5 text-accent" />
                    <h2 className="font-heading text-xl font-bold text-primary-text">Recently Added</h2>
                  </div>
                  <div className="space-y-4">
                    {newTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.name}
                          href={tool.url}
                          className="group flex items-center gap-4 p-4 rounded-xl border border-border-color bg-card-bg hover:bg-hover-bg/30 transition-colors duration-200"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-bg group-hover:bg-accent/10 group-hover:text-accent text-secondary-text shrink-0 transition-colors">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading text-sm font-semibold text-primary-text group-hover:text-accent transition-colors truncate">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-secondary-text truncate mt-0.5">{tool.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-secondary-text/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* SECTION 7: Why ToolNagri */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-border-color pt-16 space-y-10"
        >
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-text">
              Secure, Fast, Offline-First Utilities
            </h2>
            <p className="text-sm text-secondary-text max-w-lg mx-auto">
              How ToolNagri keeps your daily development workflows private and responsive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-border-color p-5 bg-card-bg hover:shadow-premium transition-shadow">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success mb-4">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="font-heading font-bold text-sm text-primary-text mb-1.5">100% Client-Side Privacy</h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Images, text structures, and code strings are processed inside your browser canvas. No server uploads.
              </p>
            </div>

            <div className="rounded-xl border border-border-color p-5 bg-card-bg hover:shadow-premium transition-shadow">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                <Zap className="h-5 w-5" />
              </span>
              <h3 className="font-heading font-bold text-sm text-primary-text mb-1.5">Instant Execution</h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Powered by React and browser API standards. Zero round-trip latency for calculations and conversions.
              </p>
            </div>

            <div className="rounded-xl border border-border-color p-5 bg-card-bg hover:shadow-premium transition-shadow">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 mb-4">
                <DollarSign className="h-5 w-5" />
              </span>
              <h3 className="font-heading font-bold text-sm text-primary-text mb-1.5">Completely Free</h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                No daily file limits, no captcha obstacles, and no subscriptions. Simple ad-free tool suite.
              </p>
            </div>

            <div className="rounded-xl border border-border-color p-5 bg-card-bg hover:shadow-premium transition-shadow">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 mb-4">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="font-heading font-bold text-sm text-primary-text mb-1.5">Premium UX Aesthetics</h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Light theme layout inspired by Stripe and Notion. Large whitespace, micro-animations, and clean typography.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
