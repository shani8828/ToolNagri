import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Slug Generator | ToolNagri",
  description: "Convert text or blog post titles into clean, URL-friendly slugs client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
