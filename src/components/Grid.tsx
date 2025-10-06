import { GameState } from '@/types/game';
import { Tile } from './Tile';
import styles from './Grid.module.css';

interface GridProps {
  gameState: GameState;
}

export function Grid({ gameState }: GridProps) {
  const renderGridCells = () => {
    const cells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        cells.push(
          <div key={`${row}-${col}`} className={styles.gridCell} />
        );
      }
    }
    return cells;
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridRow}>
        {renderGridCells()}
      </div>
      <div className={styles.tileContainer}>
        {gameState.tiles.map(tile => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
}