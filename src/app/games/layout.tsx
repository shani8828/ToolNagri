import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Online Mini Games - Play in Browser with No Downloads",
  description:
    "Play free interactive browser mini-games on ToolNagri. Neon Snake, 2048 Neon Fusion, Memory Match & Simon Matrix, and Wordle Unlimited. Local high scores, instant load, works offline.",
  path: "/games",
  keywords: [
    "free online games",
    "browser mini games",
    "neon snake game",
    "2048 online free",
    "memory match brain game",
    "wordle unlimited free",
    "play games without download",
  ],
});

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
