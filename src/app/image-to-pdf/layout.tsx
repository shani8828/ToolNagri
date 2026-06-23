import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF Converter | ToolNagri",
  description: "Convert PNG, JPG, and JPEG image files into a single, clean PDF document client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
