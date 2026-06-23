import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free URL Shortener | ToolNagri",
  description: "Shorten long tracking links, generate QR codes, and view click metrics in real-time. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
