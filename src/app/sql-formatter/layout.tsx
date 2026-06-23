import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter & Minifier | ToolNagri",
  description: "Format messy database queries with proper indentation or compress statements to minified strings. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
