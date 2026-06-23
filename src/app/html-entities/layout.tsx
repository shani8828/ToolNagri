import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder & Decoder | ToolNagri",
  description: "Convert text characters to HTML entity code representations and decode escaped strings back. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
