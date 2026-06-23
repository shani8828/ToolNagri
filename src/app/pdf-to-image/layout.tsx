import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Image Converter | ToolNagri",
  description: "Convert pages of a PDF document into high-quality PNG or JPG images client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
