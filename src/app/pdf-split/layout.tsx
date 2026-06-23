import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Page Splitter | ToolNagri",
  description: "Extract specific page ranges or split single pages from any PDF document client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
