import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader | ToolNagri",
  description: "Extract static preview and high-resolution thumbnail images from any YouTube URL. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
