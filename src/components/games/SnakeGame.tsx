"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Zap, Sparkles, Shield, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { soundFx } from "@/lib/games/audio";
import { recordGameSession } from "@/lib/games/storage";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Difficulty = "chill" | "classic" | "hyper";

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: "golden" | "multiplier" | "ghost";
  expiresAt: number;
}

const GRID_SIZE = 22; // 22x22 cells

const DIFFICULTY_SETTINGS: Record<Difficulty, { speed: number; wallDeath: boolean; label: string }> = {
  chill: { speed: 130, wallDeath: false, label: "Chill" },
  classic: { speed: 90, wallDeath: true, label: "Classic" },
  hyper: { speed: 60, wallDeath: true, label: "Hyper" },
};

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number, won?: boolean) => void;
  onVictory: (score: number) => void;
  triggerCelebration: () => void;
  resetGameTrigger: number;
}

export default function SnakeGame({
  onScoreUpdate,
  onGameOver,
  triggerCelebration,
  resetGameTrigger,
}: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("classic");
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);
  const [comboCount, setComboCount] = useState(0);

  // Snake State
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const powerUpRef = useRef<PowerUp | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const multiplierRef = useRef<number>(1);
  const ghostModeRef = useRef<boolean>(false);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // Spawn random food avoiding snake body
  const spawnFood = useCallback((): Point => {
    const snake = snakeRef.current;
    let newPos: Point;
    let collision: boolean;
    do {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      collision = snake.some((seg) => seg.x === newPos.x && seg.y === newPos.y);
    } while (collision);
    return newPos;
  }, []);

  // Spawn powerup with 25% chance after eating food
  const maybeSpawnPowerUp = useCallback(() => {
    if (powerUpRef.current) return;
    if (Math.random() < 0.3) {
      const types: ("golden" | "multiplier" | "ghost")[] = ["golden", "multiplier", "ghost"];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const pos = spawnFood();
      powerUpRef.current = {
        x: pos.x,
        y: pos.y,
        type: chosenType,
        expiresAt: Date.now() + 8000,
      };
    }
  }, [spawnFood]);

  // Create explosion particles
  const addParticles = (x: number, y: number, color: string, count = 15) => {
    const particles = particlesRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.push({
        x: x * (canvasRef.current?.width || 440) / GRID_SIZE + (canvasRef.current?.width || 440) / (GRID_SIZE * 2),
        y: y * (canvasRef.current?.height || 440) / GRID_SIZE + (canvasRef.current?.height || 440) / (GRID_SIZE * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3 + 2,
        alpha: 1,
        life: 1,
      });
    }
  };

  // Reset Game
  const resetGame = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    foodRef.current = { x: 16, y: 10 };
    powerUpRef.current = null;
    particlesRef.current = [];
    multiplierRef.current = 1;
    ghostModeRef.current = false;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setActivePowerUp(null);
    setPowerUpTimeLeft(0);
    setComboCount(0);
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  // Handle external restart trigger
  useEffect(() => {
    if (resetGameTrigger > 0) {
      resetGame();
    }
  }, [resetGameTrigger, resetGame]);

  // Input controller
  const handleDirectionChange = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    if (
      (newDir === "UP" && current !== "DOWN") ||
      (newDir === "DOWN" && current !== "UP") ||
      (newDir === "LEFT" && current !== "RIGHT") ||
      (newDir === "RIGHT" && current !== "LEFT")
    ) {
      nextDirectionRef.current = newDir;
      soundFx.playClick(800, 0.02);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        soundFx.playClick();
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          handleDirectionChange("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          handleDirectionChange("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          handleDirectionChange("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          handleDirectionChange("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, handleDirectionChange, resetGame]);

  // Touch Swipe Controls
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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
        handleDirectionChange(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        handleDirectionChange(dy > 0 ? "DOWN" : "UP");
      }
    }
    touchStartRef.current = null;
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { speed, wallDeath } = DIFFICULTY_SETTINGS[difficulty];

    const step = (timestamp: number) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;
      const elapsed = timestamp - lastTickRef.current;

      if (elapsed > speed) {
        lastTickRef.current = timestamp;

        // Move Snake
        directionRef.current = nextDirectionRef.current;
        const head = { ...snakeRef.current[0] };

        switch (directionRef.current) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Wall Collision / Wraparound
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          if (wallDeath && !ghostModeRef.current) {
            // Game Over
            soundFx.playGameOver();
            setGameOver(true);
            setIsPlaying(false);
            const { isNewHighScore } = recordGameSession("snake", score);
            if (isNewHighScore) triggerCelebration();
            onGameOver(score);
            return;
          } else {
            // Wraparound
            if (head.x < 0) head.x = GRID_SIZE - 1;
            if (head.x >= GRID_SIZE) head.x = 0;
            if (head.y < 0) head.y = GRID_SIZE - 1;
            if (head.y >= GRID_SIZE) head.y = 0;
          }
        }

        // Self collision check
        const hitSelf = snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y);
        if (hitSelf && !ghostModeRef.current) {
          soundFx.playGameOver();
          setGameOver(true);
          setIsPlaying(false);
          const { isNewHighScore } = recordGameSession("snake", score);
          if (isNewHighScore) triggerCelebration();
          onGameOver(score);
          return;
        }

        const newSnake = [head, ...snakeRef.current];

        // Check Food
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          soundFx.playEat();
          addParticles(head.x, head.y, "#10b981", 16);
          const pointsEarned = 10 * multiplierRef.current;
          setScore((prev) => {
            const nextScore = prev + pointsEarned;
            onScoreUpdate(nextScore);
            return nextScore;
          });
          setComboCount((c) => c + 1);
          foodRef.current = spawnFood();
          maybeSpawnPowerUp();
        } else if (
          powerUpRef.current &&
          head.x === powerUpRef.current.x &&
          head.y === powerUpRef.current.y
        ) {
          // PowerUp eaten
          soundFx.playPowerUp();
          const p = powerUpRef.current;
          if (p.type === "golden") {
            addParticles(p.x, p.y, "#fbbf24", 25);
            setScore((prev) => {
              const nextScore = prev + 50;
              onScoreUpdate(nextScore);
              return nextScore;
            });
            setActivePowerUp("Golden Apple (+50 Pts)");
          } else if (p.type === "multiplier") {
            addParticles(p.x, p.y, "#38bdf8", 25);
            multiplierRef.current = 2;
            setActivePowerUp("2X Multiplier (6s)");
            setTimeout(() => {
              multiplierRef.current = 1;
              setActivePowerUp(null);
            }, 6000);
          } else if (p.type === "ghost") {
            addParticles(p.x, p.y, "#c084fc", 25);
            ghostModeRef.current = true;
            setActivePowerUp("Ghost Mode (Wall Pass 6s)");
            setTimeout(() => {
              ghostModeRef.current = false;
              setActivePowerUp(null);
            }, 6000);
          }
          powerUpRef.current = null;
        } else {
          newSnake.pop(); // Remove tail segment
        }

        // Check powerup expiration
        if (powerUpRef.current && Date.now() > powerUpRef.current.expiresAt) {
          powerUpRef.current = null;
        }

        snakeRef.current = newSnake;
      }

      // Render Graphics
      render(ctx, canvas.width, canvas.height);
      gameLoopRef.current = requestAnimationFrame(step);
    };

    gameLoopRef.current = requestAnimationFrame(step);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isPaused, gameOver, difficulty, score, onScoreUpdate, onGameOver, triggerCelebration, spawnFood, maybeSpawnPowerUp]);

  // Render Canvas
  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cellSize = width / GRID_SIZE;

    // Dark cyberpunk grid background
    ctx.fillStyle = "#0c1520";
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(225, 233, 241, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Food (Glowing Neon Green Orb)
    const food = foodRef.current;
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    const foodRadius = cellSize * 0.4;

    ctx.save();
    ctx.shadowColor = "#10b981";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fill();

    // Food Inner Core
    ctx.fillStyle = "#ecfdf5";
    ctx.beginPath();
    ctx.arc(foodX - 1, foodY - 1, foodRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // PowerUp if present
    const powerUp = powerUpRef.current;
    if (powerUp) {
      const px = powerUp.x * cellSize + cellSize / 2;
      const py = powerUp.y * cellSize + cellSize / 2;
      const pColor =
        powerUp.type === "golden" ? "#fbbf24" : powerUp.type === "multiplier" ? "#38bdf8" : "#c084fc";

      ctx.save();
      ctx.shadowColor = pColor;
      ctx.shadowBlur = 18;
      ctx.fillStyle = pColor;
      ctx.beginPath();
      ctx.arc(px, py, cellSize * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Powerup icon letter
      ctx.fillStyle = "#0c1520";
      ctx.font = `bold ${cellSize * 0.55}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const char = powerUp.type === "golden" ? "★" : powerUp.type === "multiplier" ? "2x" : "G";
      ctx.fillText(char, px, py);
      ctx.restore();
    }

    // Snake Rendering
    const snake = snakeRef.current;
    const isGhost = ghostModeRef.current;

    snake.forEach((seg, index) => {
      const segX = seg.x * cellSize;
      const segY = seg.y * cellSize;

      ctx.save();
      if (index === 0) {
        // Head
        ctx.shadowColor = isGhost ? "#c084fc" : "#10b981";
        ctx.shadowBlur = 16;
        ctx.fillStyle = isGhost ? "#d8b4fe" : "#6ee7b7";
        ctx.beginPath();
        ctx.roundRect(segX + 1, segY + 1, cellSize - 2, cellSize - 2, 6);
        ctx.fill();

        // Snake Eyes
        ctx.fillStyle = "#0c1520";
        const eyeSize = cellSize * 0.16;
        const dir = directionRef.current;
        let eye1 = { x: segX + cellSize * 0.3, y: segY + cellSize * 0.3 };
        let eye2 = { x: segX + cellSize * 0.7, y: segY + cellSize * 0.3 };

        if (dir === "DOWN") {
          eye1 = { x: segX + cellSize * 0.3, y: segY + cellSize * 0.7 };
          eye2 = { x: segX + cellSize * 0.7, y: segY + cellSize * 0.7 };
        } else if (dir === "LEFT") {
          eye1 = { x: segX + cellSize * 0.3, y: segY + cellSize * 0.3 };
          eye2 = { x: segX + cellSize * 0.3, y: segY + cellSize * 0.7 };
        } else if (dir === "RIGHT") {
          eye1 = { x: segX + cellSize * 0.7, y: segY + cellSize * 0.3 };
          eye2 = { x: segX + cellSize * 0.7, y: segY + cellSize * 0.7 };
        }

        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body Segments with tapering opacity & color
        const alpha = Math.max(0.35, 1 - index / (snake.length * 1.5));
        ctx.fillStyle = isGhost
          ? `rgba(192, 132, 252, ${alpha})`
          : `rgba(16, 185, 129, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(segX + 1.5, segY + 1.5, cellSize - 3, cellSize - 3, 4);
        ctx.fill();
      }
      ctx.restore();
    });

    // Particle explosions
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      p.life -= 0.035;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      {/* Top Game Bar: Score, Multiplier, Difficulty */}
      <div className="flex w-full items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Difficulty Selector */}
          <div className="inline-flex rounded-xl border border-border-color bg-secondary-bg p-1 text-xs font-semibold">
            {(["chill", "classic", "hyper"] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setDifficulty(d);
                  if (isPlaying) resetGame();
                }}
                className={`rounded-lg px-2.5 py-1 transition-colors ${
                  difficulty === d
                    ? "bg-accent text-background shadow-xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {DIFFICULTY_SETTINGS[d].label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Score Display */}
        <div className="flex items-center gap-3">
          {activePowerUp && (
            <span className="animate-pulse rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-400">
              ⚡ {activePowerUp}
            </span>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-sm font-bold text-emerald-600">
            <span>Score:</span>
            <span className="text-base font-mono font-extrabold">{score}</span>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        className="relative w-full aspect-square max-w-110 rounded-2xl overflow-hidden border-2 border-border-color bg-[#0c1520] shadow-2xl touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="w-full h-full block cursor-pointer"
          onClick={() => {
            if (!isPlaying || gameOver) resetGame();
          }}
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver || isPaused) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0c1520]/85 backdrop-blur-xs p-6 text-center text-white animate-fade-in">
            {gameOver ? (
              <>
                <span className="text-4xl mb-2">💥</span>
                <h2 className="font-heading text-2xl font-extrabold text-red-400">Game Over</h2>
                <p className="mt-1 text-sm text-gray-300">
                  Final Score: <strong className="text-emerald-400 text-lg">{score}</strong>
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-gray-950 transition-all hover:bg-emerald-400 active:scale-95 shadow-lg"
                >
                  <RotateCcw className="h-4 w-4" /> Play Again
                </button>
              </>
            ) : isPaused ? (
              <>
                <Pause className="h-10 w-10 text-amber-400 mb-2" />
                <h2 className="font-heading text-2xl font-bold">Game Paused</h2>
                <button
                  type="button"
                  onClick={() => setIsPaused(false)}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 font-semibold text-background hover:bg-accent-light"
                >
                  <Play className="h-4 w-4" /> Resume
                </button>
              </>
            ) : (
              <>
                <span className="text-5xl mb-3 animate-bounce">🐍</span>
                <h2 className="font-heading text-2xl font-extrabold text-white">Neon Snake Arena</h2>
                <p className="mt-2 text-xs text-gray-400 max-w-xs leading-relaxed">
                  Collect luminous food, grab power-ups, and survive the cyber arena!
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-gray-950 transition-all hover:bg-emerald-400 active:scale-95 shadow-lg"
                >
                  <Play className="h-4 w-4" /> Start Game
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Neon D-Pad Touch Controls */}
      <div className="mt-4 flex flex-col items-center gap-2 sm:hidden w-full max-w-70">
        <button
          type="button"
          onClick={() => handleDirectionChange("UP")}
          aria-label="Up"
          className="flex h-12 w-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 active:bg-emerald-500/30 transition-transform active:scale-95 shadow-xs"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => handleDirectionChange("LEFT")}
            aria-label="Left"
            className="flex h-12 w-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 active:bg-emerald-500/30 transition-transform active:scale-95 shadow-xs"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label="Pause"
            className="flex h-10 w-14 items-center justify-center rounded-xl border border-border-color bg-secondary-bg text-secondary-text text-xs font-bold"
          >
            {isPaused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => handleDirectionChange("RIGHT")}
            aria-label="Right"
            className="flex h-12 w-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 active:bg-emerald-500/30 transition-transform active:scale-95 shadow-xs"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => handleDirectionChange("DOWN")}
          aria-label="Down"
          className="flex h-12 w-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 active:bg-emerald-500/30 transition-transform active:scale-95 shadow-xs"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
