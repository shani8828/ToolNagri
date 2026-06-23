import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Image Encoder & Decoder | ToolNagri",
  description: "Upload local image files to instantly get raw Base64 data URLs, or render images from Base64 strings. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
