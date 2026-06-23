import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to YAML / YAML to JSON | ToolNagri",
  description: "Bi-directional formatting and conversion tool between JSON objects and YAML structures client-side. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
