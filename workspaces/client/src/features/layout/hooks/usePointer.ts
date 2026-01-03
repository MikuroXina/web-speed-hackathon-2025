import { useEffect, useState } from 'react';

export function usePointer(): { x: number; y: number } {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handlePointerMove = (ev: MouseEvent) => {
      setPointer({
        x: ev.clientX,
        y: ev.clientY,
      });
    };
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);
  return pointer;
}
