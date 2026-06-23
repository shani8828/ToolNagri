import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator | ToolNagri",
  description: "Perform common business percentage calculations (percentage change, ratios, additions, and splits). Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
