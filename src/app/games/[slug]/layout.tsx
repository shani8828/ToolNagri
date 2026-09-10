import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug } from "@/lib/games/game-data";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game Not Found",
    };
  }

  return pageMetadata({
    title: game.seoTitle,
    description: game.seoDescription,
    path: `/games/${game.slug}`,
    keywords: [
      game.title.toLowerCase(),
      `${game.slug} game online`,
      "free browser game",
      "no download mini game",
    ],
  });
}

export default function SingleGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
