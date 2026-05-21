import { create } from 'zustand';

/**
 * Scene phases drive the scroll-flythrough (wired up in Step 4) and the
 * day -> dusk lighting tween. `progress` is 0..1 across the entire scroll.
 */
export type ScenePhase = 'hero' | 'services' | 'gallery' | 'contact';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SceneState {
  phase: ScenePhase;
  progress: number;
  perf: 'high' | 'medium' | 'low';
  /** Monotonically incremented on every firefly burst trigger. */
  burstNonce: number;
  /** True when user OS-level prefers-reduced-motion. */
  reducedMotion: boolean;
  /** True while the document tab is hidden — used to pause the canvas. */
  pageHidden: boolean;
  /** 0..4 (continuous) — Math.floor is the current season; fractional part is the lerp. */
  seasonClock: number;
  /** User override; if null we cycle automatically. */
  seasonOverride: Season | null;
  setPhase: (p: ScenePhase) => void;
  setProgress: (p: number) => void;
  setPerf: (p: 'high' | 'medium' | 'low') => void;
  triggerBurst: () => void;
  setReducedMotion: (v: boolean) => void;
  setPageHidden: (v: boolean) => void;
  setSeasonClock: (v: number) => void;
  setSeasonOverride: (s: Season | null) => void;
}

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
export function currentSeason(s: SceneState): Season {
  if (s.seasonOverride) return s.seasonOverride;
  return SEASONS[Math.floor(s.seasonClock) % 4];
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: 'hero',
  progress: 0,
  perf: 'high',
  burstNonce: 0,
  reducedMotion: false,
  pageHidden: false,
  seasonClock: 0,
  seasonOverride: null,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setPerf: (perf) => set({ perf }),
  triggerBurst: () => set((s) => ({ burstNonce: s.burstNonce + 1 })),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setPageHidden: (pageHidden) => set({ pageHidden }),
  setSeasonClock: (seasonClock) => set({ seasonClock }),
  setSeasonOverride: (seasonOverride) => set({ seasonOverride }),
}));
