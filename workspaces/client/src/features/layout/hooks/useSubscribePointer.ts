import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribePointer(): void {
  const layout = useStore((s) => s.features.layout);

  useEffect(() => {
    const handlePointerMove = (ev: MouseEvent) => {
      layout.updatePointer({
        x: ev.clientX,
        y: ev.clientY,
      });
    };
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);
}
