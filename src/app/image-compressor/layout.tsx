import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor | ToolNagri",
  description: "Reduce image file sizes instantly while preserving quality using client-side canvas parsing. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
