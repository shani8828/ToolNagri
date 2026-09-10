"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Trophy,
  Sparkles,
  Zap,
  Search,
  Flame,
  Brain,
  Grid3X3,
  Layers,
  ArrowRight,
  Shield,
  WifiOff,
  Clock,
} from "lucide-react";
import { GAMES_CATALOG } from "@/lib/games/game-data";
import { GameCategory } from "@/lib/games/types";
import GameCard from "@/components/games/GameCard";
import { getPlayerStats, ACHIEVEMENTS_CATALOG } from "@/lib/games/storage";

const CATEGORY_TABS: { id: "all" | GameCategory; label: string; icon: typeof Gamepad2 }[] = [
  { id: "all", label: "All Games", icon: Layers },
  { id: "arcade", label: "Arcade Action", icon: Gamepad2 },
  { id: "puzzle", label: "Puzzle & Logic", icon: Grid3X3 },
  { id: "brain", label: "Brain & Memory", icon: Brain },
  { id: "word", label: "Word Games", icon: Sparkles },
];

export default function GamesHubPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | GameCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalPlayed: 0,
    achievementsCount: 0,
    topScore: 0,
  });

  useEffect(() => {
    const playerStats = getPlayerStats();
    const scores = Object.values(playerStats.highScores);
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

    setStats({
      totalPlayed: playerStats.totalGamesPlayed || 0,
      achievementsCount: playerStats.unlockedAchievements?.length || 0,
      topScore: maxScore,
    });
  }, []);

  const filteredGames = GAMES_CATALOG.filter((game) => {
    const matchesCategory = activeCategory === "all" || game.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      game.title.toLowerCase().includes(query) ||
      game.tagline.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ───────────────────────────── Hero ───────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-border-color bg-linear-to-br from-card-bg via-secondary-bg/50 to-card-bg p-8 sm:p-12 shadow-premium">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-500">
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Instant Play · No Downloads · 100% Free</span>
          </span>

          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-primary-text sm:text-4xl lg:text-5xl">
            Pass time with addictive, interactive mini-games
          </h1>

          <p className="mt-4 text-base leading-relaxed text-secondary-text sm:text-lg">
            Relax and challenge your reflexes with Neon Snake, 2048 Neon Fusion, Memory Match, and
            Wordle Unlimited. All games run locally in your browser with persistent high scores and offline support.
          </p>

          {/* Quick Player Stats Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border-color/80 pt-6">
            <div className="flex items-center gap-2 rounded-xl border border-border-color bg-card-bg px-3.5 py-2 shadow-xs">
              <Gamepad2 className="h-4 w-4 text-emerald-500" />
              <div className="text-xs">
                <span className="text-secondary-text">Games Played: </span>
                <strong className="font-bold text-primary-text">{stats.totalPlayed}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border-color bg-card-bg px-3.5 py-2 shadow-xs">
              <Trophy className="h-4 w-4 text-amber-500" />
              <div className="text-xs">
                <span className="text-secondary-text">Top Score: </span>
                <strong className="font-bold text-primary-text">{stats.topScore}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border-color bg-card-bg px-3.5 py-2 shadow-xs">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <div className="text-xs">
                <span className="text-secondary-text">Badges Unlocked: </span>
                <strong className="font-bold text-primary-text">
                  {stats.achievementsCount}/{ACHIEVEMENTS_CATALOG.length}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* ──────────────────────── Controls & Filters ──────────────────────── */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-accent text-background shadow-xs"
                    : "border border-border-color bg-card-bg text-secondary-text hover:bg-hover-bg hover:text-primary-text"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary-text" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games…"
            className="w-full rounded-xl border border-border-color bg-card-bg py-2 pl-9 pr-4 text-xs text-primary-text placeholder-secondary-text outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      {/* ──────────────────────── Games Grid ──────────────────────── */}
      <div className="stagger mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => <GameCard key={game.slug} game={game} />)
        ) : (
          <div className="col-span-full py-16 text-center text-secondary-text">
            <p className="text-sm">No games found matching your search.</p>
          </div>
        )}
      </div>

      {/* ──────────────────────── Feature Highlights ──────────────────────── */}
      <div className="mt-16 rounded-3xl border border-border-color bg-secondary-bg/40 p-8 sm:p-12">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-primary-text">
          Why Play on ToolNagri?
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-bg border border-border-color text-emerald-500 shadow-xs mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-primary-text">Zero Lag & Instant Load</h3>
            <p className="mt-1 text-xs text-secondary-text leading-relaxed">
              Every mini-game is optimized in lightweight Vanilla JavaScript and React for maximum 60FPS fluid gameplay.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-bg border border-border-color text-amber-500 shadow-xs mb-3">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-primary-text">Local Storage Saves</h3>
            <p className="mt-1 text-xs text-secondary-text leading-relaxed">
              Your high scores, board states, streaks, and unlocked achievements stay safely stored in your browser.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-bg border border-border-color text-indigo-500 shadow-xs mb-3">
              <WifiOff className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-primary-text">Plays Offline</h3>
            <p className="mt-1 text-xs text-secondary-text leading-relaxed">
              Once loaded, all games run 100% locally. No internet connection or heavy server roundtrips needed.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-bg border border-border-color text-rose-500 shadow-xs mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-sm font-bold text-primary-text">No Sign-up or Paywalls</h3>
            <p className="mt-1 text-xs text-secondary-text leading-relaxed">
              No registration, no tokens, and no conversion caps. Pure arcade fun whenever you want a quick break.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
