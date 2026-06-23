import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNS Lookup Resolver | ToolNagri",
  description: "Lookup A, AAAA, MX, CNAME, and TXT DNS records for domains using Cloudflare DNS over HTTPS. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
