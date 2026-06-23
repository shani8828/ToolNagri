import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UTM Campaign URL Builder | ToolNagri",
  description: "Build campaign URLs with Google Analytics tracking tags to analyze promotion sources. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
