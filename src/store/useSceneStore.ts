import { create } from 'zustand';
import { type ZoneId, nodeProgress } from '@/scene/navigationNodes';

/**
 * Scene phases drive the day -> dusk lighting tween. `progress` is 0..1
 * across the whole experience. Zones are the new click-to-explore layer:
 * `navigateTo` requests a fly-in, NavigationRig performs the GSAP tween and
 * keeps `progress` in sync so all downstream shaders interpolate as before.
 */
export type ScenePhase = 'hero' | 'services' | 'gallery' | 'contact';

/** Map a zone onto the legacy phase so Navbar / PhaseIndicator keep working. */
function zoneToPhase(z: ZoneId | null): ScenePhase {
  if (!z || z === 'entry') return 'hero';
  if (z === 'lawn' || z === 'hedges') return 'services';
  if (z === 'flowerbeds' || z === 'patio') return 'gallery';
  return 'contact';
}

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

  /** Zone whose detail panel is currently shown (camera has arrived). */
  activeZone: ZoneId | null;
  /** Zone the camera is flying toward (null = idle). */
  targetZone: ZoneId | null;
  /** Hotspot currently under the pointer (for glow state). */
  hoveredZone: ZoneId | null;
  /** True during a GSAP fly-in — blocks new navigate calls. */
  isFlying: boolean;

  setPhase: (p: ScenePhase) => void;
  setProgress: (p: number) => void;
  setPerf: (p: 'high' | 'medium' | 'low') => void;
  triggerBurst: () => void;
  setReducedMotion: (v: boolean) => void;
  setPageHidden: (v: boolean) => void;

  navigateTo: (zone: ZoneId) => void;
  setActiveZone: (zone: ZoneId | null) => void;
  setTargetZone: (zone: ZoneId | null) => void;
  setHoveredZone: (zone: ZoneId | null) => void;
  setIsFlying: (v: boolean) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  phase: 'hero',
  progress: 0,
  perf: 'high',
  burstNonce: 0,
  reducedMotion: false,
  pageHidden: false,

  activeZone: null,
  targetZone: null,
  hoveredZone: null,
  isFlying: false,

  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setPerf: (perf) => set({ perf }),
  triggerBurst: () => set((s) => ({ burstNonce: s.burstNonce + 1 })),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setPageHidden: (pageHidden) => set({ pageHidden }),

  /**
   * Request a fly-in. Sets targetZone + isFlying; NavigationRig (inside the
   * R3F tree) reacts to the targetZone change and runs the GSAP tween. The
   * `progress` is nudged to the target fraction immediately so reduced-motion
   * users (who skip the tween) still see correct lighting.
   */
  navigateTo: (zone) => {
    const { isFlying, targetZone, activeZone, reducedMotion } = get();
    if (isFlying || zone === targetZone || zone === activeZone) return;
    set({ targetZone: zone, isFlying: true });
    if (reducedMotion) set({ progress: nodeProgress(zone) });
  },
  setActiveZone: (zone) => set({ activeZone: zone, phase: zoneToPhase(zone) }),
  setTargetZone: (zone) => set({ targetZone: zone }),
  setHoveredZone: (zone) => set({ hoveredZone: zone }),
  setIsFlying: (v) => set({ isFlying: v }),
}));
