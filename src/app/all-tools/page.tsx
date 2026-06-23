"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { ALL_TOOLS } from "@/lib/tools";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Calculators": "Calculate dates, ages, financial metrics, and values instantly.",
  "Image Tools": "Compress and convert standard visual file types in-browser.",
  "PDF Tools": "Compile, merge, and split PDF documents locally inside your browser.",
  "Developer Tools": "Validate payloads, format files, and encode strings securely.",
  "Utility Tools": "Convert daily measuring parameters and timezones in real-time.",
  "Text Tools": "Analyze character limits, reading speeds, word counts, and text density.",
  "SEO Tools": "Generate marketing tags and check index settings to boost site views.",
  "Social Tools": "Parse video previews and extract high-resolution cover templates."
};

export default function AllTools() {
  const [searchQuery, setSearchQuery] = useState("");

  // Group ALL_TOOLS by their category dynamically
  const groupsMap: Record<string, typeof ALL_TOOLS> = {};
  ALL_TOOLS.forEach((tool) => {
    if (!groupsMap[tool.category]) {
      groupsMap[tool.category] = [];
    }
    groupsMap[tool.category].push(tool);
  });

  const categoryGroups = Object.keys(groupsMap).map((categoryName) => ({
    categoryName,
    description: CATEGORY_DESCRIPTIONS[categoryName] || "Essential utility tools for daily digital tasks.",
    tools: groupsMap[categoryName]
  }));

  const filteredGroups = categoryGroups.map((group) => {
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
