import { useState, useCallback } from 'react';
import { GameState, Direction } from '@/types/game';
import { initializeGame, move } from '@/utils/gameLogic';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initializeGame);

  const moveHandler = useCallback((direction: Direction) => {
    setGameState(prevState => move(prevState, direction));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
  }, []);

  return {
    gameState,
    move: moveHandler,
    resetGame
  };
}