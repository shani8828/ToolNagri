"use client";

import { PlayerStats, GameAchievement } from "./types";

const STATS_KEY = "toolnagri_player_stats";
const SAVED_SESSION_PREFIX = "toolnagri_game_session_";

const DEFAULT_STATS: PlayerStats = {
  totalGamesPlayed: 0,
  highScores: {},
  bestTimes: {},
  streaks: {},
  unlockedAchievements: [],
};

export const ACHIEVEMENTS_CATALOG: GameAchievement[] = [
  {
    id: "first_game",
    gameSlug: "any",
    title: "First Steps",
    description: "Play your first game on ToolNagri Arcade",
    icon: "🎮",
    condition: "Play any game once",
  },
  {
    id: "snake_50",
    gameSlug: "snake",
    title: "Viper Striker",
    description: "Reach a score of 50 or higher in Neon Snake",
    icon: "🐍",
    condition: "Score 50+ in Snake",
  },
  {
    id: "snake_150",
    gameSlug: "snake",
    title: "Anaconda Master",
    description: "Reach a score of 150 or higher in Neon Snake",
    icon: "👑",
    condition: "Score 150+ in Snake",
  },
  {
    id: "2048_1024",
    gameSlug: "2048",
    title: "Kilobyte King",
    description: "Create a 1024 tile in 2048 Neon Fusion",
    icon: "⚡",
    condition: "Spawn 1024 tile",
  },
  {
    id: "2048_winner",
    gameSlug: "2048",
    title: "2048 Legend",
    description: "Achieve the mythical 2048 tile!",
    icon: "🏆",
    condition: "Reach 2048 tile",
  },
  {
    id: "memory_speedster",
    gameSlug: "memory-match",
    title: "Photographic Mind",
    description: "Complete Memory Match in under 45 seconds",
    icon: "🧠",
    condition: "Finish Memory Match in < 45s",
  },
  {
    id: "memory_simon_7",
    gameSlug: "memory-match",
    title: "Pattern Genius",
    description: "Reach level 7 in Simon Sequence Mode",
    icon: "🔮",
    condition: "Simon level 7+",
  },
  {
    id: "wordle_1st_try",
    gameSlug: "wordle",
    title: "Oracle Guess",
    description: "Guess the hidden word on the 1st or 2nd try",
    icon: "🎯",
    condition: "Solve Wordle in <= 2 tries",
  },
  {
    id: "wordle_streak_3",
    gameSlug: "wordle",
    title: "Word Wizard",
    description: "Maintain a 3-game winning streak in Wordle",
    icon: "🔥",
    condition: "Win 3 Wordle games consecutively",
  },
];

export function getPlayerStats(): PlayerStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      highScores: parsed.highScores || {},
      bestTimes: parsed.bestTimes || {},
      streaks: parsed.streaks || {},
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function savePlayerStats(stats: Partial<PlayerStats>): PlayerStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const current = getPlayerStats();
    const updated: PlayerStats = {
      ...current,
      ...stats,
      highScores: { ...current.highScores, ...(stats.highScores || {}) },
      bestTimes: { ...current.bestTimes, ...(stats.bestTimes || {}) },
      streaks: { ...current.streaks, ...(stats.streaks || {}) },
      unlockedAchievements: Array.from(new Set([...current.unlockedAchievements, ...(stats.unlockedAchievements || [])])),
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_STATS;
  }
}

/**
 * Record a completed game and check for achievements.
 * Returns newly unlocked achievements if any.
 */
export function recordGameSession(
  gameSlug: string,
  score?: number,
  timeSeconds?: number,
  won?: boolean
): { newlyUnlocked: GameAchievement[]; isNewHighScore: boolean } {
  if (typeof window === "undefined") return { newlyUnlocked: [], isNewHighScore: false };

  const currentStats = getPlayerStats();
  const currentHighScore = currentStats.highScores[gameSlug] || 0;
  let isNewHighScore = false;

  const newHighScores = { ...currentStats.highScores };
  if (score !== undefined && score > currentHighScore) {
    newHighScores[gameSlug] = score;
    isNewHighScore = true;
  }

  const newBestTimes = { ...currentStats.bestTimes };
  if (timeSeconds !== undefined) {
    const currentBest = currentStats.bestTimes[gameSlug];
    if (currentBest === undefined || timeSeconds < currentBest) {
      newBestTimes[gameSlug] = timeSeconds;
    }
  }

  const newStreaks = { ...currentStats.streaks };
  if (won !== undefined) {
    if (won) {
      newStreaks[gameSlug] = (newStreaks[gameSlug] || 0) + 1;
    } else {
      newStreaks[gameSlug] = 0;
    }
  }

  const newlyUnlocked: GameAchievement[] = [];
  const currentAchievements = new Set(currentStats.unlockedAchievements);

  // Check achievements
  if (!currentAchievements.has("first_game")) {
    newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "first_game")!);
  }

  if (gameSlug === "snake" && score !== undefined) {
    if (score >= 50 && !currentAchievements.has("snake_50")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "snake_50")!);
    }
    if (score >= 150 && !currentAchievements.has("snake_150")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "snake_150")!);
    }
  }

  if (gameSlug === "2048" && score !== undefined) {
    if (score >= 1024 && !currentAchievements.has("2048_1024")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "2048_1024")!);
    }
    if (score >= 2048 && !currentAchievements.has("2048_winner")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "2048_winner")!);
    }
  }

  if (gameSlug === "memory-match") {
    if (timeSeconds !== undefined && timeSeconds <= 45 && !currentAchievements.has("memory_speedster")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "memory_speedster")!);
    }
    if (score !== undefined && score >= 7 && !currentAchievements.has("memory_simon_7")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "memory_simon_7")!);
    }
  }

  if (gameSlug === "wordle") {
    if (won && score !== undefined && score <= 2 && !currentAchievements.has("wordle_1st_try")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "wordle_1st_try")!);
    }
    if ((newStreaks["wordle"] || 0) >= 3 && !currentAchievements.has("wordle_streak_3")) {
      newlyUnlocked.push(ACHIEVEMENTS_CATALOG.find((a) => a.id === "wordle_streak_3")!);
    }
  }

  const validNewlyUnlocked = newlyUnlocked.filter(Boolean);

  const updatedAchievements = [
    ...currentStats.unlockedAchievements,
    ...validNewlyUnlocked.map((a) => a.id),
  ];

  savePlayerStats({
    totalGamesPlayed: currentStats.totalGamesPlayed + 1,
    highScores: newHighScores,
    bestTimes: newBestTimes,
    streaks: newStreaks,
    unlockedAchievements: updatedAchievements,
    lastPlayedAt: {
      ...currentStats.lastPlayedAt,
      [gameSlug]: new Date().toISOString(),
    },
  });

  return {
    newlyUnlocked: validNewlyUnlocked,
    isNewHighScore,
  };
}

/**
 * Save active game session state (e.g. 2048 grid, Wordle guesses)
 */
export function saveGameSession<T>(gameSlug: string, state: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${SAVED_SESSION_PREFIX}${gameSlug}`, JSON.stringify(state));
  } catch {
    // Ignore storage quota or disabled errors
  }
}

/**
 * Retrieve saved game session state
 */
export function getSavedGameSession<T>(gameSlug: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${SAVED_SESSION_PREFIX}${gameSlug}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Clear saved session
 */
export function clearGameSession(gameSlug: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${SAVED_SESSION_PREFIX}${gameSlug}`);
  } catch {
    // Ignore
  }
}
