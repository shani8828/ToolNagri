import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time zone Converter | ToolNagri",
  description: "Compare and translate dates and times across major global timezones simultaneously. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
