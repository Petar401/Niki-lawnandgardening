import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@/store/useSceneStore';

/**
 * Drives the global `seasonClock` forward at a steady rate. One full
 * spring→winter cycle takes ~150 seconds, slow enough to feel ambient
 * but fast enough that a visitor sees the transition before leaving.
 */
const SECONDS_PER_SEASON = 38; // 4 × 38 ≈ 2½ minutes per full year

export function SeasonCycler() {
  useFrame((_, dt) => {
    const { seasonOverride, seasonClock, setSeasonClock, pageHidden, reducedMotion } =
      useSceneStore.getState();
    if (seasonOverride || pageHidden) return;
    // Reduced motion users still get the seasons, just at 1/4 speed.
    const step = dt / SECONDS_PER_SEASON / (reducedMotion ? 4 : 1);
    setSeasonClock(seasonClock + step);
  });
  return null;
}
