import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter | ToolNagri",
  description: "Convert Markdown syntax into clean HTML output with live preview rendering and one-click copy. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
