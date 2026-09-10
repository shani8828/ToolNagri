import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Gamepad2, Sparkles, HelpCircle, Trophy, ArrowRight } from "lucide-react";
import { getGameBySlug, GAMES_CATALOG } from "@/lib/games/game-data";
import GamePlayArea from "@/components/games/GamePlayArea";
import GameCard from "@/components/games/GameCard";

export async function generateStaticParams() {
  return GAMES_CATALOG.map((g) => ({
    slug: g.slug,
  }));
}

export default async function SingleGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const otherGames = GAMES_CATALOG.filter((g) => g.slug !== slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ──────────────────────── Breadcrumbs ──────────────────────── */}
      <nav aria-label="Breadcrumbs" className="mb-6 flex items-center gap-2 text-xs text-secondary-text">
        <Link href="/" className="hover:text-primary-text transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/games" className="hover:text-primary-text transition-colors">
          Games
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-primary-text">{game.title}</span>
      </nav>

      {/* ──────────────────────── Active Game Frame ──────────────────────── */}
      <GamePlayArea game={game} />

      {/* ──────────────────────── Game Details & Guide ──────────────────────── */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-border-color pt-8">
        <div className="md:col-span-7 space-y-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-primary-text">
              About {game.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary-text">
              {game.description}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-base font-bold text-primary-text">
              Game Rules & Strategy
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary-text list-disc pl-5">
              {game.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border-color bg-secondary-bg/50 p-5">
            <h3 className="font-heading text-sm font-bold text-primary-text">
              Key Features
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-secondary-text">
              {game.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border-color bg-secondary-bg/50 p-5">
            <h3 className="font-heading text-sm font-bold text-primary-text">
              Device Controls
            </h3>
            <div className="mt-3 space-y-2 text-xs text-secondary-text">
              <p>
                <strong className="text-primary-text">Desktop:</strong> {game.controls.desktop.join(", ")}
              </p>
              <p>
                <strong className="text-primary-text">Mobile:</strong> {game.controls.mobile.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────── More Games Carousel ──────────────────────── */}
      <div className="mt-16 border-t border-border-color pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-primary-text">
              More Mini-Games
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Try our other quick browser games to pass your time
            </p>
          </div>
          <Link
            href="/games"
            className="text-xs font-semibold text-primary-text hover:underline underline-offset-4 flex items-center gap-1"
          >
            All Games <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherGames.map((og) => (
            <GameCard key={og.slug} game={og} />
          ))}
        </div>
      </div>
    </div>
  );
}
