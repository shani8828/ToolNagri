import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ToolNagri",
  description: "Read the Privacy Policy of ToolNagri to understand how we protect and process your local browser session data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
