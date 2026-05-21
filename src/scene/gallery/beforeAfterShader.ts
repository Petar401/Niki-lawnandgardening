/**
 * Before/After split shader.
 *  - Two textures, one split uniform in [0,1].
 *  - Left of split shows BEFORE, right shows AFTER.
 *  - A soft seam stripe gives the slider position a visible affordance.
 *  - Subtle warm vignette on the AFTER side biases the eye toward the
 *    transformation.
 */
export const beforeAfterVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const beforeAfterFrag = /* glsl */ `
  precision highp float;
  uniform sampler2D uBefore;
  uniform sampler2D uAfter;
  uniform float uSplit;        // 0..1
  uniform float uSeamWidth;    // half-width in uv
  uniform vec3  uSeamColor;
  uniform float uReveal;       // 0..1 fade-in with gallery intensity
  varying vec2 vUv;

  void main() {
    vec3 b = texture2D(uBefore, vUv).rgb;
    vec3 a = texture2D(uAfter,  vUv).rgb;

    // 1 on the BEFORE (left) side, 0 on the AFTER (right) side.
    float beforeMask = step(vUv.x, uSplit);
    vec3 col = mix(a, b, beforeMask);

    // Warm light bias on the AFTER side.
    float afterMask = 1.0 - beforeMask;
    col += vec3(0.05, 0.04, 0.0) * afterMask;

    // Seam highlight: bright stripe + faint outer glow.
    float seamDist = abs(vUv.x - uSplit);
    float core = smoothstep(uSeamWidth, 0.0, seamDist);
    float halo = smoothstep(uSeamWidth * 3.5, 0.0, seamDist);
    col = mix(col, uSeamColor, core * 0.85);
    col += uSeamColor * halo * 0.12;

    // Reveal fade-in.
    col *= uReveal;

    // Soft vignette so the photo feels framed.
    vec2 q = vUv - 0.5;
    float vig = 1.0 - smoothstep(0.45, 0.85, length(q));
    col *= mix(0.78, 1.0, vig);

    gl_FragColor = vec4(col, uReveal);
  }
`;
