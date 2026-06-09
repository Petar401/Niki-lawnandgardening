import * as THREE from 'three';

/**
 * Tapered grass blade: 7 verts, 5 tris, ~unit-height.
 * Extra mid segment (y=0.65) lets the vertex shader apply a smooth
 * mid-blade bow without a hard kink.
 *
 *           6 (tip)
 *          / \
 *         4---5  (upper-mid, y=0.65)
 *         |   |
 *         2---3  (lower-mid, y=0.33)
 *         |   |
 *         0---1  (base, y=0)
 *
 * UV.y carries height ratio (0 base, 1 tip) — the vertex shader uses it
 * as the bend exponent so motion concentrates at the tip.
 */
export function makeBladeGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();

  const positions = new Float32Array([
    -0.06,  0.0,  0,  // 0 base-left
     0.06,  0.0,  0,  // 1 base-right
    -0.05,  0.33, 0,  // 2 lower-mid-left
     0.05,  0.33, 0,  // 3 lower-mid-right
    -0.03,  0.65, 0,  // 4 upper-mid-left
     0.03,  0.65, 0,  // 5 upper-mid-right
     0.0,   1.0,  0,  // 6 tip
  ]);

  const uvs = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 0.33,
    1.0, 0.33,
    0.0, 0.65,
    1.0, 0.65,
    0.5, 1.0,
  ]);

  // CCW so default `frontSide` shows; we render DoubleSide anyway.
  const indices = new Uint16Array([
    0, 1, 3,
    0, 3, 2,
    2, 3, 5,
    2, 5, 4,
    4, 5, 6,
  ]);

  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  g.computeVertexNormals();
  return g;
}
