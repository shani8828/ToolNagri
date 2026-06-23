import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 w-full bg-background">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
