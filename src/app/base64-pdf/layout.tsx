import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 to PDF Converter | ToolNagri",
  description: "Convert Base64 data streams back to PDF files, or upload a PDF to extract its Base64 code string. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
