import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Password Generator | ToolNagri",
  description: "Generate highly secure, cryptographically random passkeys with customizable options. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
