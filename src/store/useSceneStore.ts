import { create } from 'zustand';

/**
 * Scene phases drive the scroll-flythrough (wired up in Step 4) and the
 * day -> dusk lighting tween. `progress` is 0..1 across the entire scroll.
 */
export type ScenePhase = 'hero' | 'services' | 'gallery' | 'contact';

interface SceneState {
  phase: ScenePhase;
  progress: number;
  perf: 'high' | 'medium' | 'low';
  /** Monotonically incremented on every firefly burst trigger. */
  burstNonce: number;
  setPhase: (p: ScenePhase) => void;
  setProgress: (p: number) => void;
  setPerf: (p: 'high' | 'medium' | 'low') => void;
  triggerBurst: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: 'hero',
  progress: 0,
  perf: 'high',
  burstNonce: 0,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setPerf: (perf) => set({ perf }),
  triggerBurst: () => set((s) => ({ burstNonce: s.burstNonce + 1 })),
}));
