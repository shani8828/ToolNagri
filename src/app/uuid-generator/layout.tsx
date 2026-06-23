import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID / GUID Generator | ToolNagri",
  description: "Generate single or bulk RFC-compliant v4 UUID/GUID keys with customization options. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
