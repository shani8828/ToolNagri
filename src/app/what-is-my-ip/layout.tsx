import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is my IP Address | ToolNagri",
  description: "Quickly lookup your public IP address, geo-location coordinates, ISP, and connection properties. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
