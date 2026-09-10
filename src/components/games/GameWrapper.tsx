"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  HelpCircle,
  Trophy,
  Share2,
  ArrowLeft,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { GameMetadata, GameAchievement } from "@/lib/games/types";
import { soundFx } from "@/lib/games/audio";
import { getPlayerStats, ACHIEVEMENTS_CATALOG } from "@/lib/games/storage";

interface GameWrapperProps {
  game: GameMetadata;
  children: (props: {
    onScoreUpdate: (score: number) => void;
    onGameOver: (finalScore: number, won?: boolean) => void;
    onVictory: (score: number) => void;
    triggerCelebration: () => void;
    isMuted: boolean;
    highScore: number;
    resetGameTrigger: number;
  }) => React.ReactNode;
  onRestart?: () => void;
}

export default function GameWrapper({ game, children, onRestart }: GameWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [unlockedToast, setUnlockedToast] = useState<GameAchievement | null>(null);

  // Sync mute state and stats
  useEffect(() => {
    setIsMuted(soundFx.getMuted());
    const stats = getPlayerStats();
    setHighScore(stats.highScores[game.slug] || 0);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [game.slug]);

  const handleToggleMute = () => {
    const nextMute = soundFx.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundFx.playClick(600);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleRestart = () => {
    soundFx.playClick(440);
    setResetTrigger((prev) => prev + 1);
    if (onRestart) onRestart();
  };

  const triggerCelebration = () => {
    soundFx.playVictory();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
      });
    } catch {
      // Ignore
    }
  };

  const handleScoreUpdate = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const handleGameOver = (_finalScore: number, won?: boolean) => {
    const stats = getPlayerStats();
    setHighScore(stats.highScores[game.slug] || 0);
  };

  const handleVictory = (score: number) => {
    triggerCelebration();
    handleScoreUpdate(score);
  };

  const handleShare = async () => {
    soundFx.playClick();
    const shareText = `I'm playing ${game.title} on ToolNagri! High score: ${highScore}. Can you beat me? 🎮`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: game.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const playerStats = getPlayerStats();
  const gameAchievements = ACHIEVEMENTS_CATALOG.filter(
    (a) => a.gameSlug === game.slug || a.gameSlug === "any"
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl border border-border-color bg-card-bg shadow-premium transition-all ${
        isFullscreen ? "p-4 sm:p-6 bg-background h-screen overflow-y-auto" : "p-4 sm:p-6"
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-color pb-4">
        {/* Left: Back to Games + Title */}
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <Link
              href="/games"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
              title="Back to all games"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg font-bold text-primary-text sm:text-xl">
                {game.title}
              </h1>
              <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${game.colorScheme.badge}`}>
                {game.categoryLabel}
              </span>
            </div>
            <p className="hidden text-xs text-secondary-text sm:block">
              {game.tagline}
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Best Score Pill */}
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500">
            <Trophy className="h-3.5 w-3.5" />
            <span>Best: {highScore}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4 text-emerald-600" />}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart Game"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
            title="Restart Game"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Rules / How to play */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setShowRules(true);
            }}
            aria-label="How to play"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
            title="How to Play"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share Game"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
            title="Share Score"
          >
            {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text transition-colors hover:bg-hover-bg hover:text-primary-text"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Game Surface */}
      <div className="mt-4 flex flex-col items-center justify-center">
        {children({
          onScoreUpdate: handleScoreUpdate,
          onGameOver: handleGameOver,
          onVictory: handleVictory,
          triggerCelebration,
          isMuted,
          highScore,
          resetGameTrigger: resetTrigger,
        })}
      </div>

      {/* Bottom Desktop / Mobile Controls Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border-color pt-4 text-xs text-secondary-text">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-primary-text">Controls:</span>
          {game.controls.desktop.map((ctrl, i) => (
            <span
              key={i}
              className="rounded-md border border-border-color bg-secondary-bg px-2 py-0.5 text-[11px] font-mono"
            >
              {ctrl}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setShowStats(true);
            }}
            className="font-medium text-secondary-text hover:text-primary-text hover:underline"
          >
            Achievements ({playerStats.unlockedAchievements.length}/{ACHIEVEMENTS_CATALOG.length})
          </button>
          <span>·</span>
          <span>100% Client-side</span>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setShowRules(false)}
          />
          <div className="animate-scale-in relative w-full max-w-lg rounded-2xl border border-border-color bg-background p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-border-color pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-500" />
                <h3 className="font-heading text-lg font-bold text-primary-text">
                  How to Play: {game.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRules(false)}
                className="rounded-lg p-1 text-secondary-text hover:bg-hover-bg hover:text-primary-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-secondary-text">
              <div>
                <h4 className="font-semibold text-primary-text mb-1">Rules & Objective:</h4>
                <ul className="list-disc space-y-1.5 pl-5">
                  {game.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-text mb-1">Key Features:</h4>
                <ul className="list-disc space-y-1 pl-5">
                  {game.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-text mb-1">Controls:</h4>
                <p className="text-xs">
                  <strong className="text-primary-text">Desktop:</strong>{" "}
                  {game.controls.desktop.join(" · ")}
                </p>
                <p className="text-xs mt-0.5">
                  <strong className="text-primary-text">Mobile:</strong>{" "}
                  {game.controls.mobile.join(" · ")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRules(false)}
              className="mt-6 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-background hover:bg-accent-light"
            >
              Got it, let's play!
            </button>
          </div>
        </div>
      )}

      {/* Achievements / Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-xs"
            onClick={() => setShowStats(false)}
          />
          <div className="animate-scale-in relative w-full max-w-md rounded-2xl border border-border-color bg-background p-6 shadow-premium max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-color pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="font-heading text-lg font-bold text-primary-text">
                  Game Achievements
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStats(false)}
                className="rounded-lg p-1 text-secondary-text hover:bg-hover-bg hover:text-primary-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {gameAchievements.map((ach) => {
                const isUnlocked = playerStats.unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                      isUnlocked
                        ? "border-amber-500/30 bg-amber-500/5 text-primary-text"
                        : "border-border-color bg-secondary-bg/50 opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-text">
                          {ach.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                            Unlocked ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary-text mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {copiedLink && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-up rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-600 backdrop-blur-md shadow-lg">
          ✓ Score challenge link copied to clipboard!
        </div>
      )}
    </div>
  );
}
