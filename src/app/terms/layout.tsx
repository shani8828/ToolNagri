import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ToolNagri",
  description: "Read the Terms and Conditions of ToolNagri. Learn about user agreements and client-side tool rules.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
