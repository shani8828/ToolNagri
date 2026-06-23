import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | ToolNagri",
  description: "View the official disclaimer for ToolNagri. Read about client-side processing, accuracy of calculations, and link safety.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
