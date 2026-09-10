"use client";

import React from "react";
import { GameMetadata } from "@/lib/games/types";
import GameWrapper from "@/components/games/GameWrapper";
import SnakeGame from "@/components/games/SnakeGame";
import Game2048 from "@/components/games/Game2048";
import MemoryGame from "@/components/games/MemoryGame";
import WordleGame from "@/components/games/WordleGame";

export default function GamePlayArea({ game }: { game: GameMetadata }) {
  return (
    <GameWrapper game={game}>
      {({ onScoreUpdate, onGameOver, onVictory, triggerCelebration, resetGameTrigger }) => {
        switch (game.slug) {
          case "snake":
            return (
              <SnakeGame
                onScoreUpdate={onScoreUpdate}
                onGameOver={onGameOver}
                onVictory={onVictory}
                triggerCelebration={triggerCelebration}
                resetGameTrigger={resetGameTrigger}
              />
            );
          case "2048":
            return (
              <Game2048
                onScoreUpdate={onScoreUpdate}
                onGameOver={onGameOver}
                onVictory={onVictory}
                triggerCelebration={triggerCelebration}
                resetGameTrigger={resetGameTrigger}
              />
            );
          case "memory-match":
            return (
              <MemoryGame
                onScoreUpdate={onScoreUpdate}
                onGameOver={onGameOver}
                onVictory={onVictory}
                triggerCelebration={triggerCelebration}
                resetGameTrigger={resetGameTrigger}
              />
            );
          case "wordle":
            return (
              <WordleGame
                onScoreUpdate={onScoreUpdate}
                onGameOver={onGameOver}
                onVictory={onVictory}
                triggerCelebration={triggerCelebration}
                resetGameTrigger={resetGameTrigger}
              />
            );
          default:
            return null;
        }
      }}
    </GameWrapper>
  );
}
