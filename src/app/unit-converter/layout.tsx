import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Unit Converter | ToolNagri",
  description: "Convert metrics across Length, Weight, Temperature, Area, and Speed in real-time. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
