"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_TOOLS } from "@/lib/tools";

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [legalOpen, setLegalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [searchOpen]);

  // Global key listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close legal dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (legalRef.current && !legalRef.current.contains(e.target as Node)) {
        setLegalOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filter tools
  const filteredTools = searchQuery.trim() === ""
    ? ALL_TOOLS.slice(0, 5) // Show top 5 tools initially
    : ALL_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === "Enter") {
      if (filteredTools.length > 0) {
        e.preventDefault();
        const selectedTool = filteredTools[selectedIndex];
        router.push(selectedTool.url);
        setSearchOpen(false);
      }
    }
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-color bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <span className="font-heading text-lg font-bold tracking-tight text-primary-text">
                  Tool<span className="text-accent">Nagri</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors">
                Home
              </Link>
              <Link href="/all-tools" className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors">
                All Tools
              </Link>

              {/* Legal Dropdown */}
              <div
                className="relative"
                ref={legalRef}
              >
                <button
                  onClick={() => setLegalOpen(!legalOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  Legal <ChevronDown className="h-3.5 w-3.5 translate-y-0.5" />
                </button>

                <AnimatePresence>
                  {legalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-48 rounded-xl border border-border-color bg-white py-2 shadow-lg z-50"
                    >
                      <Link
                        href="/privacy"
                        onClick={() => setLegalOpen(false)}
                        className="block px-4 py-2 text-sm text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href="/terms"
                        onClick={() => setLegalOpen(false)}
                        className="block px-4 py-2 text-sm text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
                      >
                        Terms of Service
                      </Link>
                      <Link
                        href="/disclaimer"
                        onClick={() => setLegalOpen(false)}
                        className="block px-4 py-2 text-sm text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
                      >
                        Disclaimer
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/contact" className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors">
                Contact
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSearchClick}
                className="flex items-center gap-2 rounded-full border border-border-color bg-secondary-bg px-4 py-1.5 text-sm text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-all duration-200 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search tools...</span>
                <span className="hidden lg:inline text-xs border border-border-color rounded bg-background px-1.5 py-0.5 text-secondary-text">
                  Ctrl+K
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-secondary-text hover:text-primary-text rounded-md hover:bg-hover-bg cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border-color bg-background px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
            >
              Home
            </Link>
            <Link
              href="/all-tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
            >
              All Tools
            </Link>


            {/* Legal Dropdown Links on Mobile */}
            <div className="px-3 py-1.5">
              <div className="text-xs font-bold text-secondary-text uppercase tracking-wider mb-2">Legal Info</div>
              <div className="pl-3 space-y-2 border-l border-border-color/80">
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-sm text-secondary-text hover:text-primary-text transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-sm text-secondary-text hover:text-primary-text transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-sm text-secondary-text hover:text-primary-text transition-colors"
                >
                  Disclaimer
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
            >
              Contact
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Modal Dialog Container */}
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none flex items-start justify-center p-4 pt-[12vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-color bg-white shadow-2xl flex flex-col max-h-[70vh] pointer-events-auto"
              >
                {/* Search Bar Input */}
                <div className="relative border-b border-border-color flex items-center p-4 gap-3 bg-secondary-bg/25">
                  <Search className="h-5 w-5 text-secondary-text shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search all online tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-primary-text placeholder-secondary-text outline-none text-sm md:text-base font-medium"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-[10px] font-bold text-secondary-text border border-border-color/80 rounded px-1.5 py-0.5 bg-background shadow-xs hover:bg-hover-bg hover:text-primary-text cursor-pointer transition-colors"
                  >
                    ESC
                  </button>
                </div>

                {/* Results List */}
                <div className="overflow-y-auto p-2 space-y-0.5 max-h-[45vh] scrollbar-thin">
                  {filteredTools.length === 0 ? (
                    <div className="p-8 text-center text-sm text-secondary-text">
                      No results found for "<span className="font-semibold text-primary-text">{searchQuery}</span>"
                    </div>
                  ) : (
                    filteredTools.map((tool, idx) => {
                      const Icon = tool.icon;
                      const isSelected = idx === selectedIndex;
                      return (
                        <Link
                          key={tool.url}
                          href={tool.url}
                          onClick={() => setSearchOpen(false)}
                          className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-150 border ${isSelected
                              ? "bg-accent/5 border-accent/25 text-accent"
                              : "bg-transparent border-transparent hover:bg-hover-bg/60 text-primary-text"
                            }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${isSelected ? "bg-accent text-white" : "bg-secondary-bg text-secondary-text"
                              }`}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold flex items-center gap-1.5 text-primary-text">
                              {tool.name}
                              {tool.isTrending && (
                                <span className="text-[8px] bg-amber-500/10 text-amber-600 px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                                  Trending
                                </span>
                              )}
                              {tool.isNew && (
                                <span className="text-[8px] bg-accent/10 text-accent px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-secondary-text truncate mt-0.5">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight
                            className={`h-4 w-4 transition-all ${isSelected ? "translate-x-1 opacity-100 text-accent" : "opacity-0"
                              }`}
                          />
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* Footer Controls */}
                <div className="border-t border-border-color bg-secondary-bg px-4 py-2.5 flex items-center justify-between text-[11px] text-secondary-text font-medium">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-0.5">
                      <span className="border border-border-color/80 px-1 py-0.2 rounded bg-background shadow-xs">↑↓</span> navigate
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <span className="border border-border-color/80 px-1.5 py-0.2 rounded bg-background shadow-xs">↵</span> open
                    </span>
                  </div>
                  <div>
                    {searchQuery ? `${filteredTools.length} results` : "Suggested tools"}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
