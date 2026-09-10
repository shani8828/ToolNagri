"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, HelpCircle, BarChart2, RotateCcw, Lightbulb, Check, AlertCircle } from "lucide-react";
import { soundFx } from "@/lib/games/audio";
import {
  recordGameSession,
  saveGameSession,
  getSavedGameSession,
  getPlayerStats,
} from "@/lib/games/storage";

const WORDS_5 = [
  "REACT", "CLOUD", "SMART", "PIXEL", "CYBER", "STACK", "LOGIC", "BRAIN", "LIGHT", "SOLAR",
  "SPEED", "SPARK", "POWER", "NEXUS", "TRACK", "VIVID", "PRISM", "FOCUS", "TURBO", "PULSE",
  "HYPER", "FLASH", "MAGIC", "OCEAN", "SPACE", "ROBOT", "ORBIT", "BLAZE", "QUEST", "SHARP",
  "AUDIO", "CODEC", "PROXY", "TOKEN", "ARRAY", "ASYNC", "FLOAT", "INDEX", "MUTEX", "QUERY",
  "CACHE", "GRAPH", "SCALE", "MACRO", "SHELL", "BUILD", "DEBUG", "SERVE", "FETCH", "ROUTE"
];

const WORDS_6 = [
  "CODING", "VECTOR", "CRYPTO", "SERVER", "SYSTEM", "NEXUS", "ENGINE", "CLIENT", "SIGNAL",
  "STREAM", "MATRIX", "PIXELS", "MODULE", "ROUTER", "SYNTAX", "THREAD", "BRANCH", "KERNEL",
  "SOCKET", "SCHEMA", "VIRTUAL", "DIGITAL", "PYTHON", "BINARY", "CIPHER", "DOMAIN", "BUFFER"
];

type WordLength = 5 | 6;
type EvaluatedLetterState = "correct" | "present" | "absent";
type LetterState = EvaluatedLetterState | "empty";

interface GuessRow {
  letters: string[];
  states: LetterState[];
}

interface WordleGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number, won?: boolean) => void;
  onVictory: (score: number) => void;
  triggerCelebration: () => void;
  resetGameTrigger: number;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

export default function WordleGame({
  onScoreUpdate,
  onGameOver,
  onVictory,
  triggerCelebration,
  resetGameTrigger,
}: WordleGameProps) {
  const [wordLength, setWordLength] = useState<WordLength>(5);
  const [targetWord, setTargetWord] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [revealedHint, setRevealedHint] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState<number>(0);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Initialize Wordle Game
  const startNewGame = useCallback((len: WordLength = wordLength) => {
    const list = len === 5 ? WORDS_5 : WORDS_6;
    const randomWord = list[Math.floor(Math.random() * list.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setRevealedHint(null);
    setHintCount(0);
    onScoreUpdate(0);
  }, [wordLength, onScoreUpdate]);

  // Init on mount or wordLength change
  useEffect(() => {
    startNewGame(wordLength);
  }, [wordLength, startNewGame]);

  // External restart trigger
  useEffect(() => {
    if (resetGameTrigger > 0) {
      startNewGame(wordLength);
    }
  }, [resetGameTrigger, wordLength, startNewGame]);

  // Evaluate letter states for a specific guess
  const evaluateGuess = useCallback(
    (guess: string): EvaluatedLetterState[] => {
      const result: EvaluatedLetterState[] = Array(wordLength).fill("absent");
      const targetChars = targetWord.split("");
      const guessChars = guess.split("");

      // First pass: mark correct green
      guessChars.forEach((ch, i) => {
        if (ch === targetChars[i]) {
          result[i] = "correct";
          targetChars[i] = "*"; // Consume letter
        }
      });

      // Second pass: mark present yellow
      guessChars.forEach((ch, i) => {
        if (result[i] !== "correct") {
          const indexInTarget = targetChars.indexOf(ch);
          if (indexInTarget !== -1) {
            result[i] = "present";
            targetChars[indexInTarget] = "*";
          }
        }
      });

      return result;
    },
    [targetWord, wordLength]
  );

  // Keyboard letter color map
  const letterStatuses = React.useMemo(() => {
    const statusMap: Record<string, LetterState> = {};
    guesses.forEach((g) => {
      const states = evaluateGuess(g);
      g.split("").forEach((ch, i) => {
        const state = states[i];
        const current = statusMap[ch];
        if (state === "correct") {
          statusMap[ch] = "correct";
        } else if (state === "present" && current !== "correct") {
          statusMap[ch] = "present";
        } else if (state === "absent" && !current) {
          statusMap[ch] = "absent";
        }
      });
    });
    return statusMap;
  }, [guesses, evaluateGuess]);

  // Submit current guess
  const submitGuess = useCallback(() => {
    if (gameStatus !== "playing") return;

    if (currentGuess.length !== wordLength) {
      soundFx.playError();
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 500);
      return;
    }

    const nextGuesses = [...guesses, currentGuess];
    const states = evaluateGuess(currentGuess);

    // Play reveal sound
    states.forEach((st, idx) => {
      setTimeout(() => {
        soundFx.playLetterReveal(st);
      }, idx * 120);
    });

    setGuesses(nextGuesses);
    setCurrentGuess("");

    if (currentGuess === targetWord) {
      // VICTORY!
      setGameStatus("won");
      const score = (7 - nextGuesses.length) * 100 - hintCount * 30;
      onScoreUpdate(score);
      setTimeout(() => {
        triggerCelebration();
        recordGameSession("wordle", nextGuesses.length, undefined, true);
        onVictory(score);
      }, wordLength * 120 + 200);
    } else if (nextGuesses.length >= 6) {
      // LOST
      setGameStatus("lost");
      soundFx.playGameOver();
      recordGameSession("wordle", 7, undefined, false);
      onGameOver(0, false);
    }
  }, [
    currentGuess,
    guesses,
    gameStatus,
    wordLength,
    targetWord,
    hintCount,
    evaluateGuess,
    onScoreUpdate,
    triggerCelebration,
    onVictory,
    onGameOver,
  ]);

  // Handle key input
  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== "playing") return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE" || key === "⌫") {
        soundFx.playClick(500, 0.02);
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < wordLength) {
        soundFx.playClick(700, 0.02);
        setCurrentGuess((prev) => prev + key.toUpperCase());
      }
    },
    [gameStatus, currentGuess, wordLength, submitGuess]
  );

  // Physical keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        handleKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyPress]);

  // Clue / Hint helper
  const handleRevealHint = () => {
    if (gameStatus !== "playing" || hintCount >= 2) return;
    soundFx.playClick(880);

    // Find a letter in target word not yet guessed in correct spot
    const unrevealedLetters = targetWord.split("").filter((ch, i) => {
      return !guesses.some((g) => g[i] === ch);
    });

    if (unrevealedLetters.length > 0) {
      const hintLetter = unrevealedLetters[0];
      setRevealedHint(`Hint: The word contains the letter "${hintLetter}"`);
      setHintCount((c) => c + 1);
    }
  };

  const playerStats = getPlayerStats();
  const streak = playerStats.streaks["wordle"] || 0;

  return (
    <div className="flex flex-col items-center w-full max-w-md select-none">
      {/* Top Bar: Word Length Selector, Hint, Stats */}
      <div className="flex w-full items-center justify-between gap-2 mb-3">
        {/* Length Selector */}
        <div className="inline-flex rounded-xl border border-border-color bg-secondary-bg p-1 text-xs font-semibold">
          {([5, 6] as WordLength[]).map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setWordLength(len);
              }}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                wordLength === len
                  ? "bg-accent text-background shadow-xs"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              {len} Letters
            </button>
          ))}
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-2">
          {/* Hint Button */}
          <button
            type="button"
            onClick={handleRevealHint}
            disabled={gameStatus !== "playing" || hintCount >= 2}
            className={`flex items-center gap-1 rounded-xl border border-border-color px-2.5 py-1 text-xs font-semibold transition-all ${
              hintCount < 2 && gameStatus === "playing"
                ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                : "opacity-40 cursor-not-allowed text-secondary-text bg-secondary-bg"
            }`}
            title="Reveal a hint"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Hint ({2 - hintCount})</span>
          </button>

          {/* Win Streak Badge */}
          <div className="flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600">
            <span>🔥 {streak} Streak</span>
          </div>
        </div>
      </div>

      {/* Hint Alert Banner */}
      {revealedHint && (
        <div className="animate-fade-in mb-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
          <span>{revealedHint}</span>
        </div>
      )}

      {/* Wordle Letter Grid (6 Rows) */}
      <div className="flex flex-col gap-1.5 sm:gap-2 mb-4">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const isCurrentRow = rowIndex === guesses.length;
          const guessString =
            rowIndex < guesses.length
              ? guesses[rowIndex]
              : isCurrentRow
              ? currentGuess
              : "";
          const states =
            rowIndex < guesses.length ? evaluateGuess(guessString) : [];
          const isShaking = shakeRow === rowIndex;

          return (
            <div
              key={rowIndex}
              className={`flex gap-1.5 sm:gap-2 transition-transform ${
                isShaking ? "animate-bounce" : ""
              }`}
            >
              {Array.from({ length: wordLength }).map((_, colIndex) => {
                const char = guessString[colIndex] || "";
                const state = states[colIndex] || "empty";

                let bgClass = "border-border-color bg-card-bg text-primary-text";
                if (rowIndex < guesses.length) {
                  if (state === "correct") {
                    bgClass = "border-emerald-500 bg-emerald-600 text-white font-extrabold shadow-md";
                  } else if (state === "present") {
                    bgClass = "border-amber-400 bg-amber-500 text-white font-extrabold shadow-md";
                  } else {
                    bgClass = "border-slate-400/40 bg-slate-600 text-white font-bold opacity-85";
                  }
                } else if (char) {
                  bgClass = "border-primary-text bg-secondary-bg/80 text-primary-text font-bold scale-[1.03]";
                }

                return (
                  <div
                    key={colIndex}
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border-2 font-heading text-xl sm:text-2xl transition-all duration-200 ${bgClass}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Game Over / Win Announcement */}
      {gameStatus !== "playing" && (
        <div className="animate-scale-in mb-4 flex flex-col items-center justify-center rounded-2xl border border-border-color bg-secondary-bg/90 p-4 text-center w-full shadow-lg">
          {gameStatus === "won" ? (
            <>
              <span className="text-3xl mb-1">🎉</span>
              <h3 className="font-heading text-lg font-bold text-emerald-600">
                Word Solved in {guesses.length} {guesses.length === 1 ? "try" : "tries"}!
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                The mystery word was <strong className="text-primary-text font-mono tracking-wider">{targetWord}</strong>
              </p>
            </>
          ) : (
            <>
              <span className="text-3xl mb-1">💔</span>
              <h3 className="font-heading text-lg font-bold text-red-500">Out of Guesses!</h3>
              <p className="text-xs text-secondary-text mt-0.5">
                The secret word was <strong className="text-primary-text font-mono tracking-wider text-sm">{targetWord}</strong>
              </p>
            </>
          )}

          <button
            type="button"
            onClick={() => startNewGame(wordLength)}
            className="mt-3 flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-background hover:bg-accent-light"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Play Another Word
          </button>
        </div>
      )}

      {/* On-Screen Virtual Keyboard */}
      <div className="flex flex-col gap-1.5 w-full max-w-sm mt-1">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 w-full">
            {row.map((k) => {
              const status = letterStatuses[k];
              let keyBg = "bg-secondary-bg hover:bg-hover-bg text-primary-text border-border-color";

              if (status === "correct") {
                keyBg = "bg-emerald-600 text-white border-emerald-500 font-bold";
              } else if (status === "present") {
                keyBg = "bg-amber-500 text-white border-amber-400 font-bold";
              } else if (status === "absent") {
                keyBg = "bg-slate-500 text-white/80 border-slate-400 opacity-60";
              }

              const isWide = k === "ENTER" || k === "⌫";

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeyPress(k)}
                  className={`flex h-11 items-center justify-center rounded-lg border text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-2xs ${
                    isWide ? "px-2 sm:px-3 text-[11px] sm:text-xs" : "flex-1"
                  } ${keyBg}`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
