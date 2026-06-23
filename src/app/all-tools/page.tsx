"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Scale,
  Globe,
  FileSpreadsheet,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface ToolItem {
  name: string;
  url: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isPopular?: boolean;
  isNew?: boolean;
}

interface CategoryGroup {
  categoryName: string;
  description: string;
  tools: ToolItem[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    categoryName: "Calculators",
    description: "Calculate dates, ages, financial metrics, and values instantly.",
    tools: [
      {
        name: "Age Calculator",
        url: "/age-calculator",
        description: "Determine exact age in years, months, weeks, days, and minutes.",
        icon: Calculator,
        isPopular: true,
      },
      {
        name: "EMI Calculator",
        url: "/emi-calculator",
        description: "Calculate monthly loan EMIs, interest payable, and total costs.",
        icon: FileSpreadsheet,
        isPopular: true,
        isNew: true,
      },
    ],
  },
  {
    categoryName: "Image & PDF Tools",
    description: "Compress formats and compile visual and text files in-browser.",
    tools: [
      {
        name: "Image Compressor",
        url: "/image-compressor",
        description: "Reduce image file sizes instantly while maintaining quality client-side.",
        icon: FileImage,
        isPopular: true,
      },
      {
        name: "JPG to WebP Converter",
        url: "/jpg-to-webp",
        description: "Convert standard images to lightweight WebP format to speed up performance.",
        icon: FileImage,
        isNew: true,
      },
      {
        name: "Merge PDF Files Online",
        url: "/pdf-merge",
        description: "Combine multiple PDF documents into a single file client-side.",
        icon: FileText,
        isNew: true,
      },
    ],
  },
  {
    categoryName: "Developer Utilities",
    description: "Beautify data patterns, create keys, and convert formats.",
    tools: [
      {
        name: "QR Code Generator",
        url: "/qr-generator",
        description: "Create fully custom styling QR codes for text, Wi-Fi networks, and contact details.",
        icon: QrCode,
        isPopular: true,
      },
      {
        name: "Secure Password Generator",
        url: "/password-generator",
        description: "Configure secure passwords with custom specifications client-side.",
        icon: Lock,
        isNew: true,
      },
      {
        name: "JSON Formatter & Validator",
        url: "/json-formatter",
        description: "Format, minify, and validate JSON snippets with syntax highlighting.",
        icon: Code2,
      },
      {
        name: "Base64 Encoder & Decoder",
        url: "/base64",
        description: "Convert raw strings or files to Base64 schema encoding and decode back.",
        icon: Code2,
        isNew: true,
      },
    ],
  },
  {
    categoryName: "Conversion & Utility Tools",
    description: "Convert daily measuring parameters and timezones in real-time.",
    tools: [
      {
        name: "Unit Converter",
        url: "/unit-converter",
        description: "Convert metrics across Length, Weight, Temperature, Area, and Speed.",
        icon: Scale,
        isNew: true,
      },
      {
        name: "Time zone Converter",
        url: "/timezone-converter",
        description: "Compare and translate dates and times across major global timezones.",
        icon: Globe,
        isNew: true,
      },
    ],
  },
  {
    categoryName: "Social & SEO Helpers",
    description: "Shorten links, track UTM campaigns, and download assets.",
    tools: [
      {
        name: "Free URL Shortener",
        url: "/url-shortener",
        description: "Shorten links, generate QR codes, and view analytics parameters.",
        icon: Link2,
        isPopular: true,
      },
      {
        name: "UTM Campaign URL Builder",
        url: "/utm-builder",
        description: "Quickly build UTM marketing campaign tags to append to your landing page URLs.",
        icon: Settings,
      },
      {
        name: "YouTube Thumbnail Downloader",
        url: "/youtube-thumbnail",
        description: "Parse and save static preview images and HD thumbnails from any YouTube link.",
        icon: Youtube,
      },
    ],
  },
];

export default function AllTools() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = CATEGORY_GROUPS.map((group) => {
    const matchingTools = group.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, tools: matchingTools };
  }).filter((group) => group.tools.length > 0);

  return (
    <div className="min-h-screen py-12 md:py-20 bg-background relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-[radial-gradient(ellipse_at_top,var(--color-accent-light)/10,transparent_50%)] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20">
            Directory
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-primary-text">
            All Online Utilities
          </h1>
          <p className="text-sm md:text-base text-secondary-text leading-relaxed">
            Browse our complete catalog of calculators, converters, formatting systems, code validators, and campaign builders, all built to run securely on the client-side.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto">
          <div className="relative rounded-xl shadow-premium border border-border-color bg-white p-1 flex items-center gap-2">
            <div className="pl-3 text-secondary-text">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all services..."
              className="w-full py-2.5 bg-transparent text-primary-text placeholder-secondary-text focus:outline-none text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold hover:text-primary-text text-secondary-text px-3 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Classified Listings */}
        <div className="space-y-12 pt-6">
          {filteredGroups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-color p-12 text-center text-sm text-secondary-text bg-secondary-bg/50 max-w-md mx-auto">
              <p className="font-semibold text-primary-text">No services found matching your search</p>
              <p className="text-xs mt-1">Try keywords like &quot;EMI&quot;, &quot;WebP&quot;, or &quot;Password&quot;.</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.categoryName} className="space-y-4">
                <div className="border-b border-border-color/60 pb-2">
                  <h2 className="font-heading text-xl font-bold text-primary-text">
                    {group.categoryName}
                  </h2>
                  <p className="text-xs text-secondary-text mt-0.5">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.name}
                        href={tool.url}
                        className="group flex flex-col justify-between p-5 rounded-xl border border-border-color bg-card-bg shadow-card hover:shadow-card-hover hover:border-accent/40 transition-all duration-300"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/5 group-hover:bg-accent/15 group-hover:scale-102 transition-all duration-200 text-accent">
                              <Icon className="h-4.5 w-4.5" />
                            </span>
                            <div className="flex gap-1.5">
                              {tool.isPopular && (
                                <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                                  Popular
                                </span>
                              )}
                              {tool.isNew && (
                                <span className="inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="font-heading text-base font-bold text-primary-text group-hover:text-accent transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-secondary-text leading-relaxed line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-2.5 border-t border-border-color/30 flex items-center justify-end text-[10px] font-semibold text-secondary-text group-hover:text-accent">
                          <span className="inline-flex items-center gap-1">
                            Launch Tool <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
