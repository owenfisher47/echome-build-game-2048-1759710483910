'use client';

import { useGame } from '@/hooks/useGame';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useTouchControls } from '@/hooks/useTouchControls';
import { Grid } from './Grid';
import { ScoreBoard } from './ScoreBoard';
import { GameOverModal } from './GameOverModal';
import styles from './Game.module.css';

export function Game() {
  const { gameState, move, resetGame } = useGame();

  useKeyboardControls({ onMove: move });
  useTouchControls({ onMove: move });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>2048</h1>
      <p className={styles.subtitle}>
        Join the tiles, get to <strong>2048!</strong>
      </p>
      <p className={styles.instructions}>
        Use arrow keys or swipe to move tiles
      </p>
      
      <ScoreBoard gameState={gameState} onRestart={resetGame} />
      
      <div className={styles.gameContainer}>
        <Grid gameState={gameState} />
        <GameOverModal gameState={gameState} onRestart={resetGame} />
      </div>
    </div>
  );
}