"use client";

import Link from "next/link";
import { Search, Wrench, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-color bg-background/85 backdrop-blur-md">
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
            <Link href="/url-shortener" className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors">
              URL Shortener
            </Link>
            <Link href="/contact" className="text-sm font-medium text-secondary-text hover:text-primary-text transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {onSearchClick ? (
              <button
                onClick={onSearchClick}
                className="flex items-center gap-2 rounded-full border border-border-color bg-secondary-bg px-4 py-1.5 text-sm text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-all duration-200 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search tools...</span>
                <span className="hidden lg:inline text-xs border border-border-color rounded bg-background px-1.5 py-0.5 text-secondary-text">
                  Ctrl+K
                </span>
              </button>
            ) : (
              <Link
                href="/#search"
                className="flex items-center gap-2 rounded-full border border-border-color bg-secondary-bg px-4 py-1.5 text-sm text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search tools...</span>
              </Link>
            )}

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
          <Link
            href="/url-shortener"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-secondary-text hover:bg-hover-bg hover:text-primary-text transition-colors"
          >
            URL Shortener
          </Link>
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
  );
}
