import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder | ToolNagri",
  description: "Encode raw text strings to Base64 format and decode Base64 strings back to text. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
