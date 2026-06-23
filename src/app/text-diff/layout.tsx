import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff Checker | ToolNagri",
  description: "Compare two text blocks side-by-side to highlight word additions, removals, and changes. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
