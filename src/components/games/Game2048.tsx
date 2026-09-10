"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { RotateCcw, Undo2, Trophy, Sparkles, Flame, Check } from "lucide-react";
import { soundFx } from "@/lib/games/audio";
import {
  recordGameSession,
  saveGameSession,
  getSavedGameSession,
} from "@/lib/games/storage";

type GridSize = 3 | 4 | 5;

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  merged?: boolean;
}

interface SavedSession2048 {
  gridSize: GridSize;
  tiles: Tile[];
  score: number;
  won: boolean;
}

const TILE_STYLES: Record<number, string> = {
  2: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 shadow-xs",
  4: "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 shadow-xs",
  8: "bg-orange-500 text-white shadow-orange-500/20 shadow-md font-bold",
  16: "bg-orange-600 text-white shadow-orange-600/25 shadow-md font-bold",
  32: "bg-rose-500 text-white shadow-rose-500/30 shadow-md font-bold",
  64: "bg-rose-600 text-white shadow-rose-600/35 shadow-lg font-extrabold",
  128: "bg-violet-600 text-white shadow-violet-600/40 shadow-lg font-extrabold ring-2 ring-violet-400/40",
  256: "bg-indigo-600 text-white shadow-indigo-600/45 shadow-lg font-extrabold ring-2 ring-indigo-400/50",
  512: "bg-cyan-600 text-white shadow-cyan-600/50 shadow-xl font-extrabold ring-2 ring-cyan-400/60",
  1024: "bg-emerald-500 text-white shadow-emerald-500/55 shadow-xl font-black ring-2 ring-emerald-300",
  2048: "bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500 text-gray-950 shadow-amber-400/60 shadow-2xl font-black ring-4 ring-amber-300 animate-pulse",
  4096: "bg-linear-to-r from-fuchsia-500 via-purple-600 to-indigo-600 text-white shadow-purple-500/70 shadow-2xl font-black ring-4 ring-fuchsia-300",
  8192: "bg-linear-to-r from-rose-500 via-red-600 to-amber-500 text-white shadow-red-500/70 shadow-2xl font-black ring-4 ring-rose-300",
};

interface Game2048Props {
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number, won?: boolean) => void;
  onVictory: (score: number) => void;
  triggerCelebration: () => void;
  resetGameTrigger: number;
}

let nextTileId = 1;

export default function Game2048({
  onScoreUpdate,
  onGameOver,
  triggerCelebration,
  resetGameTrigger,
}: Game2048Props) {
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [history, setHistory] = useState<{ tiles: Tile[]; score: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [highestTile, setHighestTile] = useState(2);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Spawn new random tile in empty spot
  const spawnRandomTile = (currentTiles: Tile[], size: GridSize): Tile[] => {
    const occupied = new Set(currentTiles.map((t) => `${t.row},${t.col}`));
    const emptySpots: { row: number; col: number }[] = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!occupied.has(`${r},${c}`)) {
          emptySpots.push({ row: r, col: c });
        }
      }
    }

    if (emptySpots.length === 0) return currentTiles;

    const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
    const val = Math.random() < 0.85 ? 2 : 4;
    const newTile: Tile = {
      id: nextTileId++,
      value: val,
      row: spot.row,
      col: spot.col,
    };

    return [...currentTiles, newTile];
  };

  // Check if any moves are possible
  const checkGameOver = (currentTiles: Tile[], size: GridSize): boolean => {
    if (currentTiles.length < size * size) return false;

    // Check adjacent tiles
    const grid: (number | null)[][] = Array.from({ length: size }, () =>
      Array(size).fill(null)
    );
    currentTiles.forEach((t) => {
      grid[t.row][t.col] = t.value;
    });

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = grid[r][c];
        if (val === null) return false;
        if (c < size - 1 && grid[r][c + 1] === val) return false;
        if (r < size - 1 && grid[r + 1][c] === val) return false;
      }
    }

    return true;
  };

  // Init / New Game
  const initGame = useCallback(
    (size = gridSize) => {
      let initial: Tile[] = [];
      initial = spawnRandomTile(initial, size);
      initial = spawnRandomTile(initial, size);

      setTiles(initial);
      setScore(0);
      setHistory([]);
      setGameOver(false);
      setHasWon(false);
      setKeepPlaying(false);
      setHighestTile(2);
      onScoreUpdate(0);

      saveGameSession("2048", {
        gridSize: size,
        tiles: initial,
        score: 0,
        won: false,
      });
    },
    [gridSize, onScoreUpdate]
  );

  // Restore saved session on mount if valid
  useEffect(() => {
    const saved = getSavedGameSession<SavedSession2048>("2048");
    if (saved && Array.isArray(saved.tiles) && saved.tiles.length > 0) {
      setGridSize(saved.gridSize || 4);
      setTiles(saved.tiles);
      setScore(saved.score || 0);
      setHasWon(saved.won || false);
      const maxVal = Math.max(...saved.tiles.map((t) => t.value), 2);
      setHighestTile(maxVal);
      onScoreUpdate(saved.score || 0);
    } else {
      initGame(4);
    }
  }, [initGame, onScoreUpdate]);

  // Handle external reset
  useEffect(() => {
    if (resetGameTrigger > 0) {
      initGame(gridSize);
    }
  }, [resetGameTrigger, initGame, gridSize]);

  // Move logic for sliding and merging
  const moveTiles = useCallback(
    (direction: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
      if (gameOver || (hasWon && !keepPlaying)) return;

      let hasMoved = false;
      let scoreGained = 0;
      let reached2048 = false;
      const size = gridSize;

      // Save history for Undo
      setHistory((prev) => [{ tiles: [...tiles], score }, ...prev.slice(0, 4)]);

      // Create grid representation
      const grid: (Tile | null)[][] = Array.from({ length: size }, () =>
        Array(size).fill(null)
      );
      tiles.forEach((t) => {
        grid[t.row][t.col] = { ...t, merged: false };
      });

      const traverseRows =
        direction === "DOWN"
          ? Array.from({ length: size }, (_, i) => size - 1 - i)
          : Array.from({ length: size }, (_, i) => i);

      const traverseCols =
        direction === "RIGHT"
          ? Array.from({ length: size }, (_, i) => size - 1 - i)
          : Array.from({ length: size }, (_, i) => i);

      const newTiles: Tile[] = [];

      for (const r of traverseRows) {
        for (const c of traverseCols) {
          const tile = grid[r][c];
          if (!tile) continue;

          let targetRow = r;
          let targetCol = c;

          if (direction === "UP") {
            while (targetRow > 0 && grid[targetRow - 1][c] === null) {
              targetRow--;
            }
          } else if (direction === "DOWN") {
            while (targetRow < size - 1 && grid[targetRow + 1][c] === null) {
              targetRow++;
            }
          } else if (direction === "LEFT") {
            while (targetCol > 0 && grid[r][targetCol - 1] === null) {
              targetCol--;
            }
          } else if (direction === "RIGHT") {
            while (targetCol < size - 1 && grid[r][targetCol + 1] === null) {
              targetCol++;
            }
          }

          // Check merge with adjacent neighbor
          let neighbor: Tile | null = null;
          let neighborRow = targetRow;
          let neighborCol = targetCol;

          if (direction === "UP" && targetRow > 0) {
            neighborRow = targetRow - 1;
            neighbor = grid[neighborRow][c];
          } else if (direction === "DOWN" && targetRow < size - 1) {
            neighborRow = targetRow + 1;
            neighbor = grid[neighborRow][c];
          } else if (direction === "LEFT" && targetCol > 0) {
            neighborCol = targetCol - 1;
            neighbor = grid[r][neighborCol];
          } else if (direction === "RIGHT" && targetCol < size - 1) {
            neighborCol = targetCol + 1;
            neighbor = grid[r][neighborCol];
          }

          if (
            neighbor &&
            neighbor.value === tile.value &&
            !neighbor.merged
          ) {
            // Merge!
            hasMoved = true;
            const mergedValue = tile.value * 2;
            scoreGained += mergedValue;

            if (mergedValue === 2048 && !hasWon) {
              reached2048 = true;
            }

            grid[r][c] = null;
            grid[neighborRow][neighborCol] = {
              id: nextTileId++,
              value: mergedValue,
              row: neighborRow,
              col: neighborCol,
              merged: true,
            };
          } else if (targetRow !== r || targetCol !== c) {
            // Slide without merge
            hasMoved = true;
            grid[r][c] = null;
            grid[targetRow][targetCol] = {
              ...tile,
              row: targetRow,
              col: targetCol,
            };
          }
        }
      }

      if (hasMoved) {
        // Collect updated tiles
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c]) {
              newTiles.push(grid[r][c]!);
            }
          }
        }

        // Spawn a new tile
        const nextTiles = spawnRandomTile(newTiles, size);
        const nextScore = score + scoreGained;

        setTiles(nextTiles);
        setScore(nextScore);
        onScoreUpdate(nextScore);

        // Sound & tier
        const maxVal = Math.max(...nextTiles.map((t) => t.value), 2);
        setHighestTile(maxVal);

        if (scoreGained > 0) {
          const tier = Math.log2(maxVal);
          soundFx.playMerge(tier);
        } else {
          soundFx.playClick(400, 0.03);
        }

        if (reached2048) {
          setHasWon(true);
          triggerCelebration();
          recordGameSession("2048", nextScore, undefined, true);
        }

        // Save session state to localStorage
        saveGameSession("2048", {
          gridSize: size,
          tiles: nextTiles,
          score: nextScore,
          won: hasWon || reached2048,
        });

        // Check game over
        if (checkGameOver(nextTiles, size)) {
          setGameOver(true);
          soundFx.playGameOver();
          recordGameSession("2048", nextScore, undefined, false);
          onGameOver(nextScore);
        }
      }
    },
    [
      gameOver,
      hasWon,
      keepPlaying,
      gridSize,
      tiles,
      score,
      onScoreUpdate,
      triggerCelebration,
      onGameOver,
    ]
  );

  // Undo Move
  const handleUndo = () => {
    if (history.length === 0) return;
    soundFx.playClick(350);
    const [previous, ...restHistory] = history;
    setTiles(previous.tiles);
    setScore(previous.score);
    setHistory(restHistory);
    setGameOver(false);
    onScoreUpdate(previous.score);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          moveTiles("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          moveTiles("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          moveTiles("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          moveTiles("RIGHT");
          break;
        case "z":
        case "Z":
        case "Backspace":
          if (e.ctrlKey || e.metaKey || e.key.toLowerCase() === "z") {
            e.preventDefault();
            handleUndo();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveTiles]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 25) {
      if (absDx > absDy) {
        moveTiles(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        moveTiles(dy > 0 ? "DOWN" : "UP");
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md select-none">
      {/* Top Bar: Grid Size Selector, Highest Tile, Score, Undo */}
      <div className="flex w-full items-center justify-between gap-2 mb-3">
        {/* Grid Selector */}
        <div className="inline-flex rounded-xl border border-border-color bg-secondary-bg p-1 text-xs font-semibold">
          {([3, 4, 5] as GridSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setGridSize(sz);
                initGame(sz);
              }}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                gridSize === sz
                  ? "bg-accent text-background shadow-xs"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              {sz}x{sz}
            </button>
          ))}
        </div>

        {/* Action buttons & Stats */}
        <div className="flex items-center gap-2">
          {/* Highest Tile Badge */}
          <div className="flex items-center gap-1 rounded-xl border border-border-color bg-secondary-bg px-2.5 py-1 text-xs font-bold text-primary-text">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span>Tile: {highestTile}</span>
          </div>

          {/* Undo Button */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`flex items-center gap-1 rounded-xl border border-border-color px-2.5 py-1 text-xs font-semibold transition-all ${
              history.length > 0
                ? "bg-secondary-bg text-primary-text hover:bg-hover-bg active:scale-95"
                : "opacity-40 cursor-not-allowed text-secondary-text"
            }`}
            title="Undo Move"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* Score Badge */}
          <div className="flex items-center gap-1 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-600">
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* 2048 Grid Board */}
      <div
        className="relative w-full aspect-square rounded-2xl border-2 border-border-color bg-secondary-bg/80 p-3 shadow-xl touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Grid Cells */}
        <div
          className="grid h-full w-full gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border-color/60 bg-card-bg/40 shadow-inner"
            />
          ))}
        </div>

        {/* Foreground Animated Tiles */}
        <div className="absolute inset-3 pointer-events-none">
          {tiles.map((tile) => {
            const widthPct = 100 / gridSize;
            const styleClass = TILE_STYLES[tile.value] || TILE_STYLES[4096];
            const fontSize =
              gridSize === 5
                ? tile.value > 1000
                  ? "text-sm sm:text-base"
                  : "text-base sm:text-lg"
                : gridSize === 3
                ? "text-2xl sm:text-3xl"
                : tile.value > 1000
                ? "text-base sm:text-xl"
                : "text-xl sm:text-2xl";

            return (
              <div
                key={tile.id}
                className={`absolute flex items-center justify-center rounded-xl transition-all duration-100 ease-out font-heading ${styleClass} ${fontSize}`}
                style={{
                  width: `calc(${widthPct}% - 0.6rem)`,
                  height: `calc(${widthPct}% - 0.6rem)`,
                  left: `calc(${tile.col * widthPct}% + 0.3rem)`,
                  top: `calc(${tile.row * widthPct}% + 0.3rem)`,
                  transform: tile.merged ? "scale(1.08)" : "scale(1)",
                }}
              >
                {tile.value}
              </div>
            );
          })}
        </div>

        {/* Game Won Modal */}
        {hasWon && !keepPlaying && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-amber-500/90 backdrop-blur-xs p-6 text-center text-white animate-scale-in">
            <span className="text-5xl mb-2 animate-bounce">🏆</span>
            <h2 className="font-heading text-3xl font-extrabold">You Reached 2048!</h2>
            <p className="mt-1 text-sm text-amber-100">
              Outstanding strategy! Current score: <strong>{score}</strong>
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setKeepPlaying(true)}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-amber-950 transition-all hover:bg-amber-50 shadow-md"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={() => initGame(gridSize)}
                className="rounded-xl border border-white/40 bg-white/20 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/30 shadow-md"
              >
                New Game
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameOver && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-foreground/85 backdrop-blur-xs p-6 text-center text-white animate-fade-in">
            <span className="text-4xl mb-2">🛑</span>
            <h2 className="font-heading text-2xl font-extrabold text-red-400">No More Moves!</h2>
            <p className="mt-1 text-sm text-gray-300">
              Final Score: <strong className="text-amber-400 text-lg">{score}</strong>
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Undo Last Move
              </button>
              <button
                type="button"
                onClick={() => initGame(gridSize)}
                className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-gray-950 transition-all hover:bg-amber-400"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Instructions for Mobile */}
      <p className="mt-3 text-center text-xs text-secondary-text">
        <span className="sm:hidden">Swipe in any direction to slide and merge tiles</span>
        <span className="hidden sm:inline">Use Arrow keys (↑, ↓, ←, →) or W/A/S/D to slide</span>
      </p>
    </div>
  );
}
