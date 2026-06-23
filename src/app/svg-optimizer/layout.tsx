import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Code Optimizer | ToolNagri",
  description: "Optimize raw SVG vector paths, strip empty elements, check layout viewports, and minify graphics. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
