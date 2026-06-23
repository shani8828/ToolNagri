import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Online Utilities Directory | ToolNagri",
  description: "Browse our complete catalog of calculators, converters, formatting systems, code validators, and campaign builders, all built to run securely on the client-side.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
