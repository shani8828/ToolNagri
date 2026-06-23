import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Web Token Debugger | ToolNagri",
  description: "Decode, read, and verify JSON Web Token parameters securely in your browser tab. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
