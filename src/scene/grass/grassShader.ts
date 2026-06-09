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

    // 3. Wind: two low-freq sines + one micro-turbulence term.
    //    Displaced by world XZ so neighbouring blades sway out of phase.
    float w1 = sin(uTime * 0.9 + worldPos.x * 0.35 + worldPos.z * 0.12);
    float w2 = cos(uTime * 0.7 + worldPos.z * 0.42 - worldPos.x * 0.08);
    float w3 = sin(uTime * 3.1 + worldPos.x * 1.8  + worldPos.z * 2.2) * 0.12;
    vec2  windDir = vec2(0.65, 0.25);   // prevailing breeze
    vec2  windOffset = windDir * ((w1 + w2) * 0.5 + w3 * 0.3) * uWindStrength;

    worldPos.x += windOffset.x * bend;
    worldPos.z += windOffset.y * bend;

    // 4. Mid-blade bow: a smooth secondary curve peaks at ~0.5 height.
    //    Makes blades look naturally drooped rather than ramrod straight.
    float midBow = smoothstep(0.3, 0.7, uv.y) * (1.0 - smoothstep(0.7, 1.0, uv.y));
    worldPos.z -= midBow * w1 * 0.1;

    // 5. Cursor push-away. Blades inside uCursorRadius lean outward.
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

    // Per-blade color variety: hash world XZ into a subtle hue nudge.
    float variety = fract(sin(dot(vWorldPos.xz, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
    col = mix(col, col * (1.0 + variety * 0.12), 0.6);

    // Base ambient occlusion: darker shadow pools between blade bases.
    float ao = smoothstep(0.0, 0.25, vUv.y);
    col *= mix(0.32, 1.0, ao);

    // Cheap "subsurface" rim: warmer where the blade faces the sun.
    float rim = clamp(dot(normalize(vec3(0.0, 1.0, 0.0)), uSunDir), 0.0, 1.0);
    col += vec3(0.18, 0.14, 0.04) * rim * smoothstep(0.5, 1.0, vUv.y);

    // Tip specular dew sheen — Phong lobe on upper blade.
    float spec = pow(max(0.0, dot(normalize(cameraPosition - vWorldPos), uSunDir)), 18.0);
    col += vec3(0.35, 0.3, 0.18) * spec * smoothstep(0.7, 1.0, vUv.y);

    // Mowing stripes: alternating light/dark bands perpendicular to view.
    float stripe = sin(vWorldPos.z * 1.3) * 0.5 + 0.5;
    col = mix(col * 0.84, col * 1.18, stripe);

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
