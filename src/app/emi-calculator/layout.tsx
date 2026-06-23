import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan EMI Calculator | ToolNagri",
  description: "Calculate monthly loan EMIs, interest payable, and total costs with payment ratio charts. Fully client-side and secure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
