import { GameMetadata } from "./types";

export const GAMES_CATALOG: GameMetadata[] = [
  {
    slug: "snake",
    title: "Neon Snake Arena",
    tagline: "Glide through the glowing cyber arena, snatch food & collect power-ups.",
    description:
      "A fast-paced retro modern arcade classic with neon graphics, particle trails, speed boosters, golden apples, and ghost power-ups. Smooth controls on desktop and mobile!",
    category: "arcade",
    categoryLabel: "Arcade Action",
    icon: "Gamepad2",
    difficulty: "Adaptive",
    playTime: "2-5 mins",
    featured: true,
    colorScheme: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    controls: {
      desktop: ["Arrow Keys or W/A/S/D to steer", "Space to Pause / Resume", "R to Restart"],
      mobile: ["Swipe anywhere on screen", "On-screen Neon D-Pad buttons", "Tap Pause button"],
    },
    rules: [
      "Steer the neon snake to consume luminous food orbs (+10 pts each).",
      "Collect Golden Apples for +50 pts and a temporary slow-motion boost.",
      "Grab Star Orbs for 2x score multipliers and Ghost Orbs to pass through walls!",
      "Avoid biting your own tail or crashing into boundaries in Classic/Hard mode.",
    ],
    features: [
      "3 Difficulty Modes: Chill (no wall death), Classic, and Hyper Speed.",
      "Real-time particle explosion and glowing trail visuals.",
      "High score and longest length auto-saved to your browser.",
      "Web Audio synthesizer sound effects with instant mute toggle.",
    ],
    seoTitle: "Neon Snake Game Online - Free Browser Arcade Mini Game",
    seoDescription:
      "Play Neon Snake online for free in your browser. Cyber neon graphics, power-ups, mobile swipe controls, and local high score tracking with no downloads.",
  },
  {
    slug: "2048",
    title: "2048 Neon Fusion",
    tagline: "Slide, merge and multiply numbers to reach the legendary 2048 tile.",
    description:
      "An addictive sliding tile puzzle in a gorgeous glassmorphic neon aesthetic. Features undo support, customizable grid sizes (3x3, 4x4, 5x5), and auto-saved sessions so you never lose your progress!",
    category: "puzzle",
    categoryLabel: "Logic & Numbers",
    icon: "Grid3X3",
    difficulty: "Medium",
    playTime: "5-15 mins",
    featured: true,
    colorScheme: {
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      border: "border-amber-500/30",
      accent: "text-amber-400",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    controls: {
      desktop: ["Arrow Keys (↑, ↓, ←, →) or W/A/S/D to slide tiles", "Z or Backspace to Undo Move", "R to Restart"],
      mobile: ["Swipe in any of the 4 directions", "Touch Undo & Restart buttons"],
    },
    rules: [
      "Swipe or press arrow keys to slide all tiles in that direction.",
      "When two tiles with the same number collide, they merge into one with double the value (2+2=4, 4+4=8).",
      "A new tile (2 or 4) spawns after each valid move.",
      "Reach the 2048 tile to win, or keep playing for endless high score mastery!",
    ],
    features: [
      "Grid Sizes: 3x3 Fast Blitz, 4x4 Standard Classic, and 5x5 Master.",
      "Smart Undo System to reverse mistakes.",
      "Auto-Save: Your active board state is persisted so you can close the tab and resume anytime.",
      "Milestone fireworks and combo pop sounds.",
    ],
    seoTitle: "2048 Neon Fusion Online - Free Number Tile Puzzle Game",
    seoDescription:
      "Play 2048 online for free. Clean modern design, move undo, 3x3/4x4/5x5 grid modes, auto-save state, and high scores stored locally in your browser.",
  },
  {
    slug: "memory-match",
    title: "Memory Matrix & Match",
    tagline: "Sharpen your focus with 3D card pair matching and Simon rhythm sequences.",
    description:
      "Dual brain-training game featuring 3D animated Card Pair Matching with combo multipliers and the classic Simon Sequence reflex challenge with musical synth tones.",
    category: "brain",
    categoryLabel: "Brain & Memory",
    icon: "Brain",
    difficulty: "Medium",
    playTime: "2-5 mins",
    featured: true,
    colorScheme: {
      gradient: "from-violet-500 via-purple-500 to-pink-500",
      border: "border-violet-500/30",
      accent: "text-violet-400",
      badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    controls: {
      desktop: ["Click cards to flip and match", "Click glowing pads in Simon mode", "Space to restart"],
      mobile: ["Tap cards or glowing pads with instant touch response"],
    },
    rules: [
      "Card Match: Flip two cards at a time to find matching pairs. Find all pairs in fewest moves and fastest time!",
      "Combo Multiplier: Find consecutive matches without misses to multiply your combo score.",
      "Simon Matrix: Watch the glowing color sequence, listen to the tones, and repeat the pattern accurately as it grows.",
    ],
    features: [
      "2 Game Modes: Card Pair Match & Simon Glowing Reflex Matrix.",
      "Themes for Card Match: Cyber Emojis, Tech Icons & Cryptic Runes.",
      "3 Grid Sizes: 4x3 (Quick), 4x4 (Classic), 6x4 (Master).",
      "Star Ratings & Best Time Records stored in your browser.",
    ],
    seoTitle: "Memory Match & Simon Matrix Game - Free Brain Training Online",
    seoDescription:
      "Train your memory and focus online. Play 3D Card Matching and Simon sequence memory puzzle with combo rewards and sound effects on ToolNagri.",
  },
  {
    slug: "wordle",
    title: "Wordle Unlimited",
    tagline: "Guess the mystery 5-letter or 6-letter word in 6 attempts or fewer.",
    description:
      "Enjoy infinite Wordle rounds or daily challenge puzzles with smart clue hints, guess distribution statistics, streak tracking, and customizable word lengths.",
    category: "word",
    categoryLabel: "Word & Logic",
    icon: "Sparkles",
    difficulty: "Adaptive",
    playTime: "3-8 mins",
    featured: false,
    colorScheme: {
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
      border: "border-blue-500/30",
      accent: "text-blue-400",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    controls: {
      desktop: ["Physical Keyboard: Type letters, press Enter to submit, Backspace to delete", "On-screen virtual keyboard"],
      mobile: ["Tap on-screen responsive keyboard keys", "Tap Hint button for clues"],
    },
    rules: [
      "Guess the hidden word in 6 tries. Each guess must be a valid word.",
      "🟩 Green: Letter is in the word and in the correct spot.",
      "🟨 Yellow: Letter is in the word but in the wrong spot.",
      "⬛ Gray: Letter is not in the word at all.",
      "Solve before running out of guesses to keep your winning streak alive!",
    ],
    features: [
      "Unlimited Free Rounds + Daily Mystery Challenge.",
      "5-Letter and 6-Letter Difficulty Modes.",
      "Smart Hint Assistant: Reveal a letter if you get stuck.",
      "Win rate percentage, current streak, and guess distribution bar chart saved locally.",
    ],
    seoTitle: "Wordle Unlimited Online - Free Word Guessing Game",
    seoDescription:
      "Play Wordle Unlimited for free in your browser. Endless puzzles, 5 & 6 letter modes, hint options, streaks, and guess distribution charts.",
  },
];

export function getGameBySlug(slug: string): GameMetadata | undefined {
  return GAMES_CATALOG.find((g) => g.slug === slug);
}

export function getGamesByCategory(category?: string): GameMetadata[] {
  if (!category || category === "all") return GAMES_CATALOG;
  return GAMES_CATALOG.filter((g) => g.category === category);
}
