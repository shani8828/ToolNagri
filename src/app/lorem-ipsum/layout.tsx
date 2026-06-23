import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator | ToolNagri",
  description: "Generate mock placeholder copy with custom sentence, paragraph, and layout parameters. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
