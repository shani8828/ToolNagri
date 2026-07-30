import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Self-hosted via next/font: the previous `@import url(fonts.googleapis.com)`
 * in globals.css was a render-blocking request to a third-party origin on
 * every page load. These are subset, preloaded and served from our own domain.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  variable: "--font-outfit",
});

/**
 * Site-wide defaults only.
 *
 * Deliberately no `alternates.canonical` here. Setting one at the root meant
 * every child route inherited the homepage canonical and declared itself a
 * duplicate. Each route now supplies its own via `pageMetadata()`, so a route
 * that forgets simply has no canonical - recoverable - instead of the wrong one.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Free Online Tools That Run in Your Browser`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [{ url: "/brandings/Logo-bgless.png", type: "image/png" }],
    shortcut: "/brandings/Logo-bgless.png",
    apple: "/brandings/Logo-bgless.png",
  },
  manifest: "/manifest.webmanifest",
  /*
    No `robots` block here. index/follow is already the default, and declaring
    it at the root stamped "index, follow" onto the 404 page alongside the
    "noindex" Next.js adds for a 404 status - two contradictory directives on
    one page. Indexable routes opt in through `pageMetadata()` instead.
  */
  verification: {
    google: "QbR9SUSpfND1I45D258mIR6etoJOu7xKMMaBA3l214A",
  },
};

export const viewport: Viewport = {
  // Matches --background so mobile browser chrome blends into the page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1520" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        GTM only. GoogleAnalytics was previously loaded alongside it, which
        fired two tag libraries for one job. Configure the GA4 tag inside the
        GTM container instead.
      */}
      <GoogleTagManager gtmId="GTM-NVFJK2H3" />
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1 w-full bg-background">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
