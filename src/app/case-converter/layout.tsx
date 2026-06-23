import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Case Text Converter | ToolNagri",
  description: "Instantly switch text cases between UPPER, lower, Title Case, camelCase, snake_case, and more. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
