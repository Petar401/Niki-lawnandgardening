import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { progressToPhase } from '@/scene/cameraPath';

/**
 * Bridges window scroll → scene store. Single shared listener for the
 * whole app. We read `scrollY / (scrollHeight - innerHeight)` instead of
 * a scroll-controls iframe trick — it's the simplest, most robust path
 * and plays nicely with browser scroll restoration on refresh.
 *
 * Uses requestAnimationFrame coalescing so we never write more than once
 * per frame even on fast trackpads / mouse-wheel storms.
 */
export function useScrollProgress() {
  useEffect(() => {
    let rafId = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const { setProgress, setPhase, phase } = useSceneStore.getState();
      setProgress(p);
      const next = progressToPhase(p);
      if (next !== phase) setPhase(next);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(apply);
    };

    apply(); // initial sync (handles refresh-with-scroll-position)
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
