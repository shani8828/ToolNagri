import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Formatter & Prettifier | ToolNagri",
  description: "Validate and format raw XML documents with styled line indentations client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
