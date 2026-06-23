import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to WebP Converter | ToolNagri",
  description: "Convert JPG and PNG images into modern, highly compressed WebP files to speed up web loading. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
