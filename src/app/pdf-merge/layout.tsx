import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online | ToolNagri",
  description: "Combine multiple PDF documents into a single file. Drag, reorder, and merge client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
