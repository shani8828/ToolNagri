import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Page Rotator | ToolNagri",
  description: "Rotate specific or all pages of a PDF document by 90, 180, or 270 degrees client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
