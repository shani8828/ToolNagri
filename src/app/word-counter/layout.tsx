import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter | ToolNagri",
  description: "Check word counts, character lengths, sentences, paragraphs, reading speed, and densities. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
