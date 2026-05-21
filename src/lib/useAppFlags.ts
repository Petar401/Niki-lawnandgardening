import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';

/**
 * Bridges OS / browser preferences into the scene store:
 *  - prefers-reduced-motion → reducedMotion
 *  - document.visibilityState → pageHidden (drives Canvas frameloop pause)
 *
 * One hook so we run a single set of listeners + initial reads.
 */
export function useAppFlags() {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => useSceneStore.getState().setReducedMotion(mql.matches);
    sync();
    mql.addEventListener?.('change', sync);
    return () => mql.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    const sync = () => useSceneStore.getState().setPageHidden(document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
}
