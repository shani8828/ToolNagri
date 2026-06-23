import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ToolNagri | Premium Online Tools by Ayodhya Serenity",
  description: "A fast, free, and premium collection of web tools for developers, designers, writers, and digital professionals. Fully client-side processing, secure and lightweight.",
  metadataBase: new URL("https://toolnagri.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brandings/Logo-bgless.png",
    shortcut: "/brandings/Logo-bgless.png",
    apple: "/brandings/Logo-bgless.png",
  },
  openGraph: {
    title: "ToolNagri | Premium Online Tools Suite",
    description: "Access high-performance developer tools, converters, calculators, and builders on a fast, clean, and ad-free platform.",
    url: "https://toolnagri.vercel.app",
    siteName: "ToolNagri",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNagri | Premium Online Tools",
    description: "Premium developer utilities, converters, calculators, and image compressors, hosted free on Vercel.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "QbR9SUSpfND1I45D258mIR6etoJOu7xKMMaBA3l214A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground animate-none">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NVFJK2H3');
            `}
          </Script>
        )}
        <Header />
        <main className="flex-1 w-full bg-background">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
