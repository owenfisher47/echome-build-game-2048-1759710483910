import { useEffect } from 'react';
import { Direction } from '@/types/game';

interface UseKeyboardControlsProps {
  onMove: (direction: Direction) => void;
  enabled?: boolean;
}

export function useKeyboardControls({ onMove, enabled = true }: UseKeyboardControlsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onMove('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          onMove('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onMove('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          onMove('right');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onMove, enabled]);
}