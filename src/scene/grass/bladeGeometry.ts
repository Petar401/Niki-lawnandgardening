import * as THREE from 'three';

/**
 * Tapered grass blade: 5 verts, 3 tris, ~unit-height.
 *
 *        4 (tip)
 *       / \
 *      2---3
 *      |   |
 *      0---1   (base, y = 0)
 *
 * UV.y carries height ratio (0 base, 1 tip) — the vertex shader uses it
 * as the bend exponent so motion concentrates at the tip.
 */
export function makeBladeGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();

  const positions = new Float32Array([
    -0.06, 0.0, 0,  // 0 base-left
     0.06, 0.0, 0,  // 1 base-right
    -0.04, 0.5, 0,  // 2 mid-left
     0.04, 0.5, 0,  // 3 mid-right
     0.0,  1.0, 0,  // 4 tip
  ]);

  const uvs = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 0.5,
    1.0, 0.5,
    0.5, 1.0,
  ]);

  // CCW so default `frontSide` shows; we render DoubleSide anyway.
  const indices = new Uint16Array([
    0, 1, 3,
    0, 3, 2,
    2, 3, 4,
  ]);

  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  g.computeVertexNormals();
  return g;
}
