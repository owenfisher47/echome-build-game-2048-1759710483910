import { GameState } from '@/types/game';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  gameState: GameState;
  onRestart: () => void;
}

export function ScoreBoard({ gameState, onRestart }: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.scores}>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreLabel}>Score</div>
          <div className={styles.scoreValue}>{gameState.score}</div>
        </div>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreLabel}>High Score</div>
          <div className={styles.scoreValue}>{gameState.highScore}</div>
        </div>
      </div>
      <button className={styles.restartButton} onClick={onRestart}>
        New Game
      </button>
    </div>
  );
}