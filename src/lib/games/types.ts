export type GameCategory = "arcade" | "puzzle" | "brain" | "word";

export interface GameMetadata {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: GameCategory;
  categoryLabel: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Adaptive";
  playTime: string;
  featured?: boolean;
  colorScheme: {
    gradient: string;
    border: string;
    accent: string;
    badge: string;
  };
  controls: {
    desktop: string[];
    mobile: string[];
  };
  rules: string[];
  features: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  highScores: Record<string, number>; // gameSlug -> score
  bestTimes: Record<string, number>; // gameSlug -> best time in seconds
  streaks: Record<string, number>; // gameSlug -> win/daily streak
  unlockedAchievements: string[]; // achievementIds
  lastPlayedAt?: Record<string, string>;
}

export interface GameAchievement {
  id: string;
  gameSlug: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}
