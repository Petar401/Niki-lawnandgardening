import { PerformanceMonitor } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';

/**
 * Auto-tier the scene: drei watches FPS and bumps a 0..1 factor up/down.
 * We translate that into a `perf` tier in the store; downstream components
 * (grass density in Step 3, post-processing in Step 4, particle count in
 * Step 8) read it and adapt.
 *
 * `<AdaptiveDpr/>` and `<AdaptiveEvents/>` are mounted in <Scene/> as a
 * second line of defense — they drop devicePixelRatio under load.
 */
export function PerfMonitor() {
  const setPerf = useSceneStore((s) => s.setPerf);
  return (
    <PerformanceMonitor
      onIncline={() => setPerf('high')}
      onDecline={() => setPerf('medium')}
      onFallback={() => setPerf('low')}
      flipflops={3}
    />
  );
}
