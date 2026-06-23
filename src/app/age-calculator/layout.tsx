import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator | ToolNagri",
  description: "Determine exact age in years, months, weeks, days, and minutes with target milestones. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
