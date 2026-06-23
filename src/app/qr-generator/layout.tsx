import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator | ToolNagri",
  description: "Create fully styled, high-res QR codes for URLs, text, Wi-Fi details, and contacts. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
