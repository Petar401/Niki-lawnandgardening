import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { ZONE_ORDER } from '@/scene/navigationNodes';

/**
 * Scroll → zone navigation fallback. Maps scroll position to the nearest
 * zone index and calls `navigateTo` when it changes (and the camera isn't
 * already flying). Hotspots / minimap / navbar remain the primary controls;
 * this lets a plain scroll walk through the garden in order.
 *
 * requestAnimationFrame-coalesced so fast wheels never write more than once
 * per frame.
 */
export function useScrollProgress() {
  useEffect(() => {
    let rafId = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const index = Math.round(p * (ZONE_ORDER.length - 1));
      const zoneId = ZONE_ORDER[index];
      const { activeZone, targetZone, isFlying, navigateTo } = useSceneStore.getState();
      if (zoneId !== activeZone && zoneId !== targetZone && !isFlying) {
        navigateTo(zoneId);
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
