export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface GameState {
  grid: (Tile | null)[][];
  score: number;
  highScore: number;
  isGameOver: boolean;
  isWon: boolean;
  tiles: Tile[];
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  row: number;
  col: number;
}