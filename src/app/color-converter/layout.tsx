import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Space Converter | ToolNagri",
  description: "Convert color codes (HEX, RGB, HSL) with real-time WCAG accessibility checks and TailwindCSS color name mapping. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
