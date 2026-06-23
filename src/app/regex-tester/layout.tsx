import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regular Expression Tester | ToolNagri",
  description: "Test regular expressions with highlights, match lists, validation, and plain English descriptions. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
