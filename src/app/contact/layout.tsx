import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ToolNagri",
  description: "Get in touch with the ToolNagri support team. Send your suggestions, feedback, or report technical bugs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
