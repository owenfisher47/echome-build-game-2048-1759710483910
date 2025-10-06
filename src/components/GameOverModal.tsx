import { GameState } from '@/types/game';
import styles from './GameOverModal.module.css';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
}

export function GameOverModal({ gameState, onRestart }: GameOverModalProps) {
  if (!gameState.isGameOver && !gameState.isWon) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {gameState.isWon ? 'You Win!' : 'Game Over!'}
        </h2>
        <p className={styles.message}>
          {gameState.isWon 
            ? 'Congratulations! You reached 2048!' 
            : 'No more moves available.'}
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Score</span>
            <span className={styles.value}>{gameState.score}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>High Score</span>
            <span className={styles.value}>{gameState.highScore}</span>
          </div>
        </div>
        <button className={styles.restartButton} onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}