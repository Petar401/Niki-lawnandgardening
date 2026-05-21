/**
 * Grass GLSL — kept inline so Vite tree-shakes & the shader hot-reloads
 * with the component. Three.js auto-injects `instanceMatrix` for
 * InstancedMesh, so we can read it directly.
 *
 * - Wind: low-freq sin/cos noise of (worldX, worldZ, time)
 * - Cursor bend: push blades away from a world-space cursor uniform
 * - Lighting: fake hemisphere using uv.y (cheap, no need for full BRDF
 *   when blades are tiny on screen)
 * - Color: mix of base + tip + a dusk tint blended by scene progress
 */
export const grassVert = /* glsl */ `
  uniform float uTime;
  uniform vec2  uCursor;     // world-space (x, z)
  uniform float uWindStrength;
  uniform float uCursorRadius;

  varying vec2  vUv;
  varying float vBend;
  varying vec3  vWorldPos;

  void main() {
    vUv = uv;

    // 1. Local -> world via the standard instancing matmul.
    vec4 instancePos = instanceMatrix * vec4(position, 1.0);
    vec4 worldPos = modelMatrix * instancePos;

    // 2. Bend strength concentrates at the tip (uv.y == 1).
    float bend = pow(uv.y, 2.0);

    // 3. Wind: two interfering low-freq sines, displaced by world XZ
    //    so neighbouring blades sway out of phase.
    float w1 = sin(uTime * 0.9 + worldPos.x * 0.35 + worldPos.z * 0.12);
    float w2 = cos(uTime * 0.7 + worldPos.z * 0.42 - worldPos.x * 0.08);
    vec2  windDir = vec2(0.65, 0.25);   // prevailing breeze
    vec2  windOffset = windDir * (w1 + w2) * 0.5 * uWindStrength;

    worldPos.x += windOffset.x * bend;
    worldPos.z += windOffset.y * bend;

    // 4. Cursor push-away. Blades inside uCursorRadius lean outward.
    vec2 toCursor = worldPos.xz - uCursor;
    float dist = length(toCursor);
    float push = smoothstep(uCursorRadius, 0.0, dist) * bend;
    vec2 dir = toCursor / max(dist, 1e-3);
    worldPos.xz += dir * push * 0.55;

    vBend = bend;
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const grassFrag = /* glsl */ `
  precision highp float;

  uniform vec3  uBaseColor;
  uniform vec3  uTipColor;
  uniform vec3  uDuskTint;
  uniform float uDusk;       // 0..1 day -> dusk
  uniform vec3  uSunDir;     // world-space, normalised
  uniform vec3  uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec2  vUv;
  varying float vBend;
  varying vec3  vWorldPos;

  void main() {
    // Vertical color gradient base -> tip.
    vec3 col = mix(uBaseColor, uTipColor, smoothstep(0.0, 1.0, vUv.y));

    // Cheap "subsurface" rim: warmer where the sun is high; fades to nothing
    // at dusk so the tint doesn't fight the cool palette.
    float sunHeight = clamp(uSunDir.y, 0.0, 1.0);
    col += vec3(0.18, 0.14, 0.04) * sunHeight * (1.0 - uDusk * 0.6) * smoothstep(0.5, 1.0, vUv.y);

    // Dusk tint blend.
    col = mix(col, uDuskTint, uDusk * 0.55);

    // Edge alpha taper so the silhouette stays soft.
    float edge = abs(vUv.x - 0.5) * 2.0;
    if (edge > 0.92 && vUv.y > 0.85) discard;

    // Linear fog to match scene fog.
    float depth = length(cameraPosition - vWorldPos);
    float fogF = smoothstep(uFogNear, uFogFar, depth);
    col = mix(col, uFogColor, fogF);

    gl_FragColor = vec4(col, 1.0);
  }
`;
