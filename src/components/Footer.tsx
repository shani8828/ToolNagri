import Link from "next/link";

import { CATEGORIES } from "@/lib/categories";
import { POPULAR_TOOLS, TOOLS, toolsInCategory } from "@/lib/tools";
import { CONTACT_EMAIL, ORG_NAME, ORG_URL, SITE_NAME } from "@/lib/site";

/**
 * Server component — no client JS. The category links here previously pointed
 * at homepage anchors (/#calculators) that no longer existed; they now target
 * the real hub pages, which also spreads internal link equity across them.
 */
export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border-color bg-secondary-bg">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              href="/"
              className="font-heading text-[17px] font-bold tracking-tight text-primary-text"
            >
              Tool<span className="text-secondary-text">Nagri</span>
            </Link>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-secondary-text">
              {TOOLS.length} free online tools that run entirely in your browser. No signup, no
              uploads, no file limits.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block text-[13px] text-secondary-text underline-offset-4 hover:text-primary-text hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Categories — split across two columns */}
          <FooterColumn title="Categories">
            {CATEGORIES.slice(0, 4).map((category) => (
              <FooterLink key={category.slug} href={`/tools/${category.slug}`}>
                {category.label}
                <span className="ml-1 text-secondary-text/60">
                  {toolsInCategory(category.slug).length}
                </span>
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="More tools">
            {CATEGORIES.slice(4).map((category) => (
              <FooterLink key={category.slug} href={`/tools/${category.slug}`}>
                {category.label}
                <span className="ml-1 text-secondary-text/60">
                  {toolsInCategory(category.slug).length}
                </span>
              </FooterLink>
            ))}
            <FooterLink href="/all-tools">All tools</FooterLink>
          </FooterColumn>

          {/* Popular */}
          <FooterColumn title="Popular">
            {POPULAR_TOOLS.slice(0, 6).map((tool) => (
              <FooterLink key={tool.slug} href={`/${tool.slug}`}>
                {tool.name}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Legal — moved out of the header, where it was taking up prime space */}
          <FooterColumn title="Legal">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/disclaimer">Disclaimer</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-color pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[12px] text-secondary-text">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-[12px] text-secondary-text">
            A product of{" "}
            <a
              href={ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-primary-text hover:underline"
            >
              {ORG_NAME}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-heading text-[11px] font-bold uppercase tracking-wider text-primary-text">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-secondary-text underline-offset-4 transition-colors hover:text-primary-text hover:underline"
      >
        {children}
      </Link>
    </li>
  );
}
