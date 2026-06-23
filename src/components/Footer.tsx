import Link from "next/link";
import { Wrench, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-color bg-secondary-bg py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-heading text-lg font-bold tracking-tight text-primary-text">
                Tool<span className="text-accent">Nagri</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-text leading-relaxed">
              A premium, lightning-fast utility platform hosting modern online tools for developers, creators, and individuals. Safe, client-side first, and entirely free.
            </p>
            <div className="flex items-center gap-2 text-sm text-secondary-text">
              <Mail className="h-4 w-4" />
              <a href="mailto:info.ayodhyaserenity@gmail.com" className="hover:text-accent transition-colors">
                info.ayodhyaserenity@gmail.com
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-primary-text uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#calculators" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link href="/#pdf-image" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Image & PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/#developer" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Developer Utilities
                </Link>
              </li>
              <li>
                <Link href="/#social-seo" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Social & SEO Helpers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-primary-text uppercase tracking-wider mb-4">
              Legal Info
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-secondary-text hover:text-accent transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate / Ownership */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-primary-text uppercase tracking-wider mb-4">
              Ayodhya Serenity
            </h3>
            <p className="text-sm text-secondary-text leading-relaxed mb-4">
              ToolNagri is a product of Ayodhya Serenity. We specialize in building fast, secure, and user-centric web platforms.
            </p>
            <a
              href="https://ayodhyaserenity.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-light transition-colors"
            >
              Visit Ayodhya Serenity
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Legal Disclaimer / Copyright */}
        <div className="mt-12 border-t border-border-color pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-secondary-text">
            © {new Date().getFullYear()} ToolNagri. All rights reserved.
          </p>
          <p className="text-xs text-secondary-text font-medium">
            Owned, operated & managed by <Link href="https://ayodhyaserenity.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Ayodhya Serenity.</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
