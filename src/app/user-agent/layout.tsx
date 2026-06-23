import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browser User Agent Parser | ToolNagri",
  description: "Analyze browser User Agent strings to extract browser name, OS version, device type, and engine info. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
