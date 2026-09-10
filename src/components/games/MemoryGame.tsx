"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Timer, Trophy, RotateCcw, Brain, Zap, Star } from "lucide-react";
import { soundFx } from "@/lib/games/audio";
import { recordGameSession } from "@/lib/games/storage";

type GameMode = "cards" | "simon";
type CardGridSize = "4x3" | "4x4" | "6x4";

interface CardItem {
  id: number;
  symbol: string;
  matched: boolean;
  flipped: boolean;
}

const EMOJI_BANK = ["🚀", "🤖", "💎", "⚡", "🔮", "🪐", "🕹️", "🎯", "🧬", "🛸", "🔥", "👑", "🌈", "🎧", "👾", "🎸"];
const TECH_BANK = ["💻", "🛡️", "🔑", "📡", "⚙️", "📱", "💾", "🔌", "🔋", "💡", "🔬", "🛰️"];

interface MemoryGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number, won?: boolean) => void;
  onVictory: (score: number) => void;
  triggerCelebration: () => void;
  resetGameTrigger: number;
}

export default function MemoryGame({
  onScoreUpdate,
  onGameOver,
  onVictory,
  triggerCelebration,
  resetGameTrigger,
}: MemoryGameProps) {
  const [gameMode, setGameMode] = useState<GameMode>("cards");
  const [cardGrid, setCardGrid] = useState<CardGridSize>("4x4");
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Simon Mode State
  const [simonSequence, setSimonSequence] = useState<number[]>([]);
  const [simonUserStep, setSimonUserStep] = useState(0);
  const [simonLevel, setSimonLevel] = useState(1);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [simonGameOver, setSimonGameOver] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Card Matching Game
  const initCardGame = useCallback((grid: CardGridSize = cardGrid) => {
    let pairCount = 8;
    if (grid === "4x3") pairCount = 6;
    if (grid === "6x4") pairCount = 12;

    const chosenSymbols = [...EMOJI_BANK].sort(() => 0.5 - Math.random()).slice(0, pairCount);
    const deck = [...chosenSymbols, ...chosenSymbols]
      .sort(() => 0.5 - Math.random())
      .map((sym, idx) => ({
        id: idx,
        symbol: sym,
        matched: false,
        flipped: false,
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setCombo(0);
    setTimerSeconds(0);
    setTimerActive(false);
    setIsCompleted(false);
    onScoreUpdate(0);
  }, [cardGrid, onScoreUpdate]);

  // Initialize Simon Sequence Game
  const initSimonGame = useCallback(() => {
    const firstStep = Math.floor(Math.random() * 4);
    setSimonSequence([firstStep]);
    setSimonUserStep(0);
    setSimonLevel(1);
    setSimonGameOver(false);
    onScoreUpdate(1);
  }, [onScoreUpdate]);

  // Handle game reset / mode change
  useEffect(() => {
    if (gameMode === "cards") {
      initCardGame(cardGrid);
    } else {
      initSimonGame();
    }
  }, [gameMode, cardGrid, initCardGame, initSimonGame]);

  // Reset trigger from wrapper
  useEffect(() => {
    if (resetGameTrigger > 0) {
      if (gameMode === "cards") initCardGame(cardGrid);
      else initSimonGame();
    }
  }, [resetGameTrigger, gameMode, cardGrid, initCardGame, initSimonGame]);

  // Card Timer Interval
  useEffect(() => {
    if (timerActive && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((t) => t + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isCompleted]);

  // Card Flip Click Handler
  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].flipped || cards[index].matched || isCompleted) {
      return;
    }

    if (!timerActive) {
      setTimerActive(true);
    }

    soundFx.playCardFlip();

    const nextFlipped = [...flippedIndices, index];
    const updatedCards = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));
    setCards(updatedCards);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const cardA = updatedCards[firstIdx];
      const cardB = updatedCards[secondIdx];

      if (cardA.symbol === cardB.symbol) {
        // MATCH!
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        soundFx.playEat();

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, matched: true, flipped: true } : c
            )
          );
          setFlippedIndices([]);
          const nextMatches = matches + 1;
          setMatches(nextMatches);

          const totalPairs = cards.length / 2;
          const score = nextMatches * 100 + nextCombo * 50;
          onScoreUpdate(score);

          if (nextMatches === totalPairs) {
            // Completed!
            setIsCompleted(true);
            setTimerActive(false);
            triggerCelebration();
            recordGameSession("memory-match", score, timerSeconds + 1, true);
            onVictory(score);
          }
        }, 300);
      } else {
        // NO MATCH
        setCombo(0);
        soundFx.playClick(240, 0.08);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Play Simon Sequence
  const playSimonSequence = useCallback((sequence: number[]) => {
    setIsShowingSequence(true);
    sequence.forEach((padIndex, i) => {
      setTimeout(() => {
        setActivePad(padIndex);
        soundFx.playTone(padIndex);
        setTimeout(() => {
          setActivePad(null);
          if (i === sequence.length - 1) {
            setIsShowingSequence(false);
          }
        }, 400);
      }, (i + 1) * 650);
    });
  }, []);

  // Trigger Simon sequence playback when level increases
  useEffect(() => {
    if (gameMode === "simon" && simonSequence.length > 0 && !simonGameOver) {
      playSimonSequence(simonSequence);
    }
  }, [gameMode, simonSequence, simonGameOver, playSimonSequence]);

  // Simon Pad Click Handler
  const handleSimonPadClick = (padIndex: number) => {
    if (isShowingSequence || simonGameOver) return;

    soundFx.playTone(padIndex);
    setActivePad(padIndex);
    setTimeout(() => setActivePad(null), 250);

    const expectedPad = simonSequence[simonUserStep];

    if (padIndex === expectedPad) {
      // Correct step
      const nextStep = simonUserStep + 1;
      if (nextStep === simonSequence.length) {
        // Round Complete! Next level
        soundFx.playVictory();
        const nextLevel = simonLevel + 1;
        setSimonLevel(nextLevel);
        setSimonUserStep(0);
        onScoreUpdate(nextLevel);

        if (nextLevel % 5 === 0) {
          triggerCelebration();
        }

        const nextSequence = [...simonSequence, Math.floor(Math.random() * 4)];
        setTimeout(() => {
          setSimonSequence(nextSequence);
        }, 800);
      } else {
        setSimonUserStep(nextStep);
      }
    } else {
      // Wrong step: Game Over
      soundFx.playGameOver();
      setSimonGameOver(true);
      recordGameSession("memory-match", simonLevel, undefined, false);
      onGameOver(simonLevel);
    }
  };

  // Star Rating Calculation
  const totalPairs = cards.length / 2;
  const optimalMoves = totalPairs + 2;
  const stars = moves <= optimalMoves ? 3 : moves <= optimalMoves + 6 ? 2 : 1;

  return (
    <div className="flex flex-col items-center w-full max-w-lg select-none">
      {/* Top Mode Switcher & Stats */}
      <div className="flex w-full items-center justify-between gap-2 mb-4">
        {/* Game Mode Selector */}
        <div className="inline-flex rounded-xl border border-border-color bg-secondary-bg p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setGameMode("cards");
            }}
            className={`rounded-lg px-3 py-1 transition-colors ${
              gameMode === "cards"
                ? "bg-accent text-background shadow-xs"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Card Match
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setGameMode("simon");
            }}
            className={`rounded-lg px-3 py-1 transition-colors ${
              gameMode === "simon"
                ? "bg-accent text-background shadow-xs"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Simon Matrix
          </button>
        </div>

        {/* Mode Specific Controls & Stats */}
        {gameMode === "cards" ? (
          <div className="flex items-center gap-2">
            {/* Grid Size */}
            <div className="hidden sm:inline-flex rounded-xl border border-border-color bg-secondary-bg p-1 text-xs font-semibold">
              {(["4x3", "4x4", "6x4"] as CardGridSize[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setCardGrid(g);
                  }}
                  className={`rounded-lg px-2 py-0.5 transition-colors ${
                    cardGrid === g
                      ? "bg-accent text-background"
                      : "text-secondary-text hover:text-primary-text"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1 rounded-xl border border-border-color bg-secondary-bg px-2.5 py-1 text-xs font-semibold text-primary-text">
              <Timer className="h-3.5 w-3.5 text-indigo-500" />
              <span>{timerSeconds}s</span>
            </div>

            {/* Moves */}
            <div className="flex items-center gap-1 rounded-xl border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-600">
              <span>Moves: {moves}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600">
              <Trophy className="h-3.5 w-3.5" />
              <span>Round {simonLevel}</span>
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────── Card Match Mode ───────────────────────── */}
      {gameMode === "cards" && (
        <div className="w-full">
          {/* Combo Indicator */}
          {combo > 1 && (
            <div className="mb-2 flex justify-center">
              <span className="animate-bounce rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-extrabold text-amber-500 shadow-xs">
                🔥 {combo}x COMBO!
              </span>
            </div>
          )}

          {/* Cards Grid Container */}
          <div
            className="grid gap-2.5 sm:gap-3 p-3 rounded-2xl border-2 border-border-color bg-secondary-bg/60 shadow-lg"
            style={{
              gridTemplateColumns:
                cardGrid === "4x3"
                  ? "repeat(4, minmax(0, 1fr))"
                  : cardGrid === "6x4"
                  ? "repeat(6, minmax(0, 1fr))"
                  : "repeat(4, minmax(0, 1fr))",
            }}
          >
            {cards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`relative aspect-square cursor-pointer rounded-xl transition-all duration-300 transform perspective-500 ${
                  card.matched
                    ? "opacity-60 scale-95 pointer-events-none"
                    : "hover:scale-[1.03] active:scale-95"
                }`}
              >
                <div
                  className={`relative h-full w-full rounded-xl border flex items-center justify-center transition-all duration-300 shadow-sm ${
                    card.flipped || card.matched
                      ? "border-violet-500/40 bg-card-bg text-3xl sm:text-4xl shadow-md rotate-y-180"
                      : "border-border-color bg-linear-to-br from-secondary-bg to-card-bg text-secondary-text hover:border-violet-400/40"
                  }`}
                >
                  {card.flipped || card.matched ? (
                    <span>{card.symbol}</span>
                  ) : (
                    <span className="text-xl opacity-30">❖</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Completion Modal */}
          {isCompleted && (
            <div className="animate-scale-in mt-4 flex flex-col items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 text-center">
              <span className="text-4xl mb-1">🎉</span>
              <h3 className="font-heading text-xl font-extrabold text-primary-text">
                Memory Board Cleared!
              </h3>
              <p className="mt-1 text-xs text-secondary-text">
                Time: <strong>{timerSeconds}s</strong> · Moves: <strong>{moves}</strong>
              </p>

              {/* Star Rating */}
              <div className="mt-2 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < stars ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => initCardGame(cardGrid)}
                className="mt-4 rounded-xl bg-accent px-6 py-2 text-sm font-semibold text-background hover:bg-accent-light"
              >
                Play Next Round
              </button>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────── Simon Reflex Mode ──────────────────────── */}
      {gameMode === "simon" && (
        <div className="flex flex-col items-center w-full">
          <p className="mb-3 text-xs text-secondary-text">
            {isShowingSequence
              ? "👀 Watch and memorize the sequence…"
              : "👉 Repeat the pattern by tapping the glowing pads"}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] aspect-square p-4 rounded-3xl border-2 border-border-color bg-[#0c1520] shadow-2xl">
            {/* Top-Left: Emerald */}
            <button
              type="button"
              onClick={() => handleSimonPadClick(0)}
              disabled={isShowingSequence}
              aria-label="Green Pad"
              className={`rounded-2xl transition-all duration-150 transform active:scale-95 ${
                activePad === 0
                  ? "bg-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.9)] scale-98"
                  : "bg-emerald-600/60 hover:bg-emerald-500/80 border border-emerald-400/30"
              }`}
            />

            {/* Top-Right: Amber */}
            <button
              type="button"
              onClick={() => handleSimonPadClick(1)}
              disabled={isShowingSequence}
              aria-label="Yellow Pad"
              className={`rounded-2xl transition-all duration-150 transform active:scale-95 ${
                activePad === 1
                  ? "bg-amber-300 shadow-[0_0_35px_rgba(252,211,77,0.9)] scale-98"
                  : "bg-amber-600/60 hover:bg-amber-500/80 border border-amber-400/30"
              }`}
            />

            {/* Bottom-Left: Crimson */}
            <button
              type="button"
              onClick={() => handleSimonPadClick(2)}
              disabled={isShowingSequence}
              aria-label="Red Pad"
              className={`rounded-2xl transition-all duration-150 transform active:scale-95 ${
                activePad === 2
                  ? "bg-rose-400 shadow-[0_0_35px_rgba(251,113,133,0.9)] scale-98"
                  : "bg-rose-600/60 hover:bg-rose-500/80 border border-rose-400/30"
              }`}
            />

            {/* Bottom-Right: Cyan */}
            <button
              type="button"
              onClick={() => handleSimonPadClick(3)}
              disabled={isShowingSequence}
              aria-label="Blue Pad"
              className={`rounded-2xl transition-all duration-150 transform active:scale-95 ${
                activePad === 3
                  ? "bg-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.9)] scale-98"
                  : "bg-cyan-600/60 hover:bg-cyan-500/80 border border-cyan-400/30"
              }`}
            />
          </div>

          {/* Simon Game Over */}
          {simonGameOver && (
            <div className="animate-scale-in mt-4 flex flex-col items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
              <span className="text-3xl mb-1">⚡</span>
              <h3 className="font-heading text-lg font-bold text-red-500">Pattern Broken!</h3>
              <p className="mt-0.5 text-xs text-secondary-text">
                You reached <strong className="text-primary-text">Round {simonLevel}</strong>
              </p>
              <button
                type="button"
                onClick={initSimonGame}
                className="mt-3 flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-background hover:bg-accent-light"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
