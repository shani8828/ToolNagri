import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universal Image Converter | ToolNagri",
  description: "Convert image files between formats like PNG, JPG, JPEG, WebP, and BMP client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
