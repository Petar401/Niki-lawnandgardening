// Shared terrain sampling. Kept in a plain TS module so it can be imported
// from non-component code (Grass, foliage, etc.) without tripping
// react-refresh's "components-only export" rule on Ground.tsx.

function hash(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function vnoise(x: number, z: number): number {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const a = hash(xi, zi);
  const b = hash(xi + 1, zi);
  const c = hash(xi, zi + 1);
  const d = hash(xi + 1, zi + 1);
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, z: number): number {
  let total = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;
  for (let i = 0; i < 4; i++) {
    total += vnoise(x * freq, z * freq) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return total / max;
}

/** World-space (x, z) → ground Y. Match Ground.tsx exactly. */
export function groundHeightAt(x: number, z: number): number {
  const large = fbm(x * 0.04, z * 0.04);
  const small = fbm(x * 0.18, z * 0.18);
  return large * 0.9 + small * 0.18 - 0.6;
}
