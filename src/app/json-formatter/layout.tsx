import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | ToolNagri",
  description: "Format, minify, and lint check JSON payloads with local browser validation. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
