"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Trophy, Play, Gamepad2, Grid3X3, Brain, Sparkles } from "lucide-react";
import { GameMetadata } from "@/lib/games/types";
import { getPlayerStats } from "@/lib/games/storage";

const ICON_MAP: Record<string, typeof Gamepad2> = {
  Gamepad2,
  Grid3X3,
  Brain,
  Sparkles,
};

export default function GameCard({ game }: { game: GameMetadata }) {
  const [highScore, setHighScore] = useState<number>(0);
  const IconComponent = ICON_MAP[game.icon] || Gamepad2;

  useEffect(() => {
    const stats = getPlayerStats();
    if (stats.highScores[game.slug]) {
      setHighScore(stats.highScores[game.slug]);
    }
  }, [game.slug]);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-color bg-card-bg p-6 transition-all duration-200 hover:-translate-y-1 hover:border-secondary-text/40 hover:shadow-card-hover"
    >
      {/* Top Header: Category Badge + High Score */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${game.colorScheme.badge}`}>
            {game.categoryLabel}
          </span>

          {highScore > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
              <Trophy className="h-3 w-3" />
              <span>{highScore}</span>
            </span>
          )}
        </div>

        {/* Icon & Title */}
        <div className="mt-5 flex items-start gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${game.colorScheme.gradient} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-primary-text group-hover:text-primary-text">
              {game.title}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-secondary-text line-clamp-2">
              {game.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info: Play time, Difficulty & Play Button */}
      <div className="mt-6 flex items-center justify-between border-t border-border-color/80 pt-4">
        <div className="flex items-center gap-2 text-[12px] text-secondary-text">
          <span>{game.difficulty}</span>
          <span>·</span>
          <span>{game.playTime}</span>
        </div>

        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary-text transition-colors group-hover:text-accent-light group-hover:underline underline-offset-4">
          Play <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
