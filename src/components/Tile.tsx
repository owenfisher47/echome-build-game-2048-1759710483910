import { Tile as TileType } from '@/types/game';
import styles from './Tile.module.css';

interface TileProps {
  tile: TileType;
}

export function Tile({ tile }: TileProps) {
  const getValueClass = (value: number) => {
    if (value <= 2) return styles.value2;
    if (value <= 4) return styles.value4;
    if (value <= 8) return styles.value8;
    if (value <= 16) return styles.value16;
    if (value <= 32) return styles.value32;
    if (value <= 64) return styles.value64;
    if (value <= 128) return styles.value128;
    if (value <= 256) return styles.value256;
    if (value <= 512) return styles.value512;
    if (value <= 1024) return styles.value1024;
    if (value <= 2048) return styles.value2048;
    return styles.valueSuper;
  };

  const className = [
    styles.tile,
    getValueClass(tile.value),
    tile.isNew ? styles.new : '',
    tile.isMerged ? styles.merged : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      style={{
        transform: `translate(${tile.col * 100}%, ${tile.row * 100}%)`
      }}
    >
      {tile.value}
    </div>
  );
}