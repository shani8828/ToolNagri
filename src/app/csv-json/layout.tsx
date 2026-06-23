import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON / JSON to CSV | ToolNagri",
  description: "Convert tabular CSV code or files to structured JSON arrays, and serialize JSON back to CSV format. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
