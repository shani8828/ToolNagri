import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Counter | ToolNagri",
  description: "Calculate total characters with and without spaces, check lines, letters, numbers, and densities. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
