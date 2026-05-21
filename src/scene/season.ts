import * as THREE from 'three';
import type { Season } from '@/store/useSceneStore';

/** Per-season colour palette for grass, foliage, sky tint, and particles. */
export interface SeasonPalette {
  grassBase: THREE.Color;
  grassTip: THREE.Color;
  leaf: THREE.Color;
  bloomColor: THREE.Color;
  /** Multiplier on the bloom material visibility (0..1). */
  bloomDensity: number;
  /** Sun colour for the directional light. */
  sun: THREE.Color;
  /** Fog tint matched to the sky for the season. */
  fog: THREE.Color;
}

const PAL: Record<Season, SeasonPalette> = {
  spring: {
    grassBase: new THREE.Color('#2e6e2c'),
    grassTip: new THREE.Color('#a9d986'),
    leaf: new THREE.Color('#74b86a'),
    bloomColor: new THREE.Color('#ffd2e0'),
    bloomDensity: 0.85,
    sun: new THREE.Color('#fff4d2'),
    fog: new THREE.Color('#cfe6ff'),
  },
  summer: {
    grassBase: new THREE.Color('#1d461d'),
    grassTip: new THREE.Color('#8fc28d'),
    leaf: new THREE.Color('#3f8a3c'),
    bloomColor: new THREE.Color('#f5b13a'),
    bloomDensity: 1.0,
    sun: new THREE.Color('#fff0c2'),
    fog: new THREE.Color('#bfe0ff'),
  },
  autumn: {
    grassBase: new THREE.Color('#46552a'),
    grassTip: new THREE.Color('#cea24a'),
    leaf: new THREE.Color('#d2772a'),
    bloomColor: new THREE.Color('#a8512b'),
    bloomDensity: 0.55,
    sun: new THREE.Color('#ffd095'),
    fog: new THREE.Color('#d9c8a6'),
  },
  winter: {
    grassBase: new THREE.Color('#3a513a'),
    grassTip: new THREE.Color('#b8cbb0'),
    leaf: new THREE.Color('#7a8c75'),
    bloomColor: new THREE.Color('#e6ecf0'),
    bloomDensity: 0.15,
    sun: new THREE.Color('#dfe6f0'),
    fog: new THREE.Color('#d6dfe9'),
  },
};

export function paletteFor(season: Season): SeasonPalette {
  return PAL[season];
}

/** Continuous lerp across the 4 seasons using a 0..4 clock. */
const SCRATCH = {
  grassBase: new THREE.Color(),
  grassTip: new THREE.Color(),
  leaf: new THREE.Color(),
  bloomColor: new THREE.Color(),
  sun: new THREE.Color(),
  fog: new THREE.Color(),
};

const ORDER: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export function blendPalette(clock: number, override: Season | null = null): SeasonPalette {
  if (override) return PAL[override];
  const c = ((clock % 4) + 4) % 4;
  const i = Math.floor(c);
  const t = c - i;
  const a = PAL[ORDER[i]];
  const b = PAL[ORDER[(i + 1) % 4]];
  SCRATCH.grassBase.copy(a.grassBase).lerp(b.grassBase, t);
  SCRATCH.grassTip.copy(a.grassTip).lerp(b.grassTip, t);
  SCRATCH.leaf.copy(a.leaf).lerp(b.leaf, t);
  SCRATCH.bloomColor.copy(a.bloomColor).lerp(b.bloomColor, t);
  SCRATCH.sun.copy(a.sun).lerp(b.sun, t);
  SCRATCH.fog.copy(a.fog).lerp(b.fog, t);
  return {
    grassBase: SCRATCH.grassBase,
    grassTip: SCRATCH.grassTip,
    leaf: SCRATCH.leaf,
    bloomColor: SCRATCH.bloomColor,
    bloomDensity: THREE.MathUtils.lerp(a.bloomDensity, b.bloomDensity, t),
    sun: SCRATCH.sun,
    fog: SCRATCH.fog,
  };
}
