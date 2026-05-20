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
  setPhase: (p: ScenePhase) => void;
  setProgress: (p: number) => void;
  setPerf: (p: 'high' | 'medium' | 'low') => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: 'hero',
  progress: 0,
  perf: 'high',
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setPerf: (perf) => set({ perf }),
}));
