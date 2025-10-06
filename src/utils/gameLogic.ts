import { Tile, GameState, Direction, Position } from '@/types/game';

const GRID_SIZE = 4;
const WIN_VALUE = 2048;

export function createEmptyGrid(): (Tile | null)[][] {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getEmptyPositions(grid: (Tile | null)[][]): Position[] {
  const positions: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col]) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
}

export function addRandomTile(grid: (Tile | null)[][]): Tile | null {
  const emptyPositions = getEmptyPositions(grid);
  if (emptyPositions.length === 0) return null;

  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  const tile: Tile = {
    id: generateId(),
    value,
    row: randomPosition.row,
    col: randomPosition.col,
    isNew: true
  };

  return tile;
}

export function initializeGame(): GameState {
  const grid = createEmptyGrid();
  const tiles: Tile[] = [];
  
  // Add two initial tiles
  for (let i = 0; i < 2; i++) {
    const tile = addRandomTile(grid);
    if (tile) {
      grid[tile.row][tile.col] = tile;
      tiles.push(tile);
    }
  }

  return {
    grid,
    score: 0,
    highScore: getHighScore(),
    isGameOver: false,
    isWon: false,
    tiles
  };
}

export function getHighScore(): number {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('2048-highscore') || '0');
  }
  return 0;
}

export function setHighScore(score: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('2048-highscore', score.toString());
  }
}

function moveTilesInDirection(tiles: Tile[], direction: Direction): { tiles: Tile[], score: number } {
  const newTiles: Tile[] = [];
  let scoreGained = 0;

  if (direction === 'left' || direction === 'right') {
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowTiles = tiles.filter(tile => tile.row === row);
      if (direction === 'right') {
        rowTiles.reverse();
      }
      
      const { processedTiles, score } = processLine(rowTiles, direction === 'left' ? 'forward' : 'backward', row, true);
      newTiles.push(...processedTiles);
      scoreGained += score;
    }
  } else {
    for (let col = 0; col < GRID_SIZE; col++) {
      const colTiles = tiles.filter(tile => tile.col === col);
      if (direction === 'down') {
        colTiles.reverse();
      }
      
      const { processedTiles, score } = processLine(colTiles, direction === 'up' ? 'forward' : 'backward', col, false);
      newTiles.push(...processedTiles);
      scoreGained += score;
    }
  }

  return { tiles: newTiles, score: scoreGained };
}

function processLine(
  tiles: Tile[], 
  direction: 'forward' | 'backward', 
  lineIndex: number, 
  isRow: boolean
): { processedTiles: Tile[], score: number } {
  const sortedTiles = tiles.sort((a, b) => {
    const posA = isRow ? a.col : a.row;
    const posB = isRow ? b.col : b.row;
    return direction === 'forward' ? posA - posB : posB - posA;
  });

  const processedTiles: Tile[] = [];
  let score = 0;
  let targetPosition = direction === 'forward' ? 0 : GRID_SIZE - 1;
  const increment = direction === 'forward' ? 1 : -1;

  for (let i = 0; i < sortedTiles.length; i++) {
    const currentTile = sortedTiles[i];
    let merged = false;

    if (processedTiles.length > 0) {
      const lastTile = processedTiles[processedTiles.length - 1];
      if (lastTile.value === currentTile.value && !lastTile.isMerged) {
        lastTile.value *= 2;
        lastTile.isMerged = true;
        score += lastTile.value;
        merged = true;
      }
    }

    if (!merged) {
      const newTile: Tile = {
        ...currentTile,
        [isRow ? 'col' : 'row']: targetPosition,
        [isRow ? 'row' : 'col']: lineIndex,
        isMerged: false
      };
      processedTiles.push(newTile);
      targetPosition += increment;
    }
  }

  return { processedTiles, score };
}

export function move(gameState: GameState, direction: Direction): GameState {
  if (gameState.isGameOver) return gameState;

  const { tiles: newTiles, score: scoreGained } = moveTilesInDirection(gameState.tiles, direction);
  
  // Check if any tile actually moved
  const hasChanged = newTiles.some(tile => {
    const originalTile = gameState.tiles.find(t => t.id === tile.id);
    return !originalTile || originalTile.row !== tile.row || originalTile.col !== tile.col || tile.isMerged;
  });

  if (!hasChanged) return gameState;

  // Create new grid
  const newGrid = createEmptyGrid();
  newTiles.forEach(tile => {
    newGrid[tile.row][tile.col] = tile;
  });

  // Add new random tile
  const newRandomTile = addRandomTile(newGrid);
  if (newRandomTile) {
    newGrid[newRandomTile.row][newRandomTile.col] = newRandomTile;
    newTiles.push(newRandomTile);
  }

  const newScore = gameState.score + scoreGained;
  const newHighScore = Math.max(gameState.highScore, newScore);
  
  if (newScore > gameState.highScore) {
    setHighScore(newScore);
  }

  // Check win condition
  const isWon = gameState.isWon || newTiles.some(tile => tile.value === WIN_VALUE);

  // Check game over condition
  const isGameOver = getEmptyPositions(newGrid).length === 0 && !canMove(newTiles);

  return {
    grid: newGrid,
    tiles: newTiles,
    score: newScore,
    highScore: newHighScore,
    isGameOver,
    isWon
  };
}

function canMove(tiles: Tile[]): boolean {
  // Check if any adjacent tiles can merge
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const currentTile = tiles.find(t => t.row === row && t.col === col);
      if (!currentTile) continue;

      // Check right neighbor
      if (col < GRID_SIZE - 1) {
        const rightTile = tiles.find(t => t.row === row && t.col === col + 1);
        if (rightTile && rightTile.value === currentTile.value) return true;
      }

      // Check bottom neighbor
      if (row < GRID_SIZE - 1) {
        const bottomTile = tiles.find(t => t.row === row + 1 && t.col === col);
        if (bottomTile && bottomTile.value === currentTile.value) return true;
      }
    }
  }

  return false;
}