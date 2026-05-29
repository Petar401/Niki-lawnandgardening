import { describe, it, expect } from 'vitest';
import { buildCameraPath, progressToPhase, WAYPOINTS } from './cameraPath';

describe('progressToPhase', () => {
  it('maps the full 0..1 range to the four phases at the documented thresholds', () => {
    expect(progressToPhase(0)).toBe('hero');
    expect(progressToPhase(0.21)).toBe('hero');
    expect(progressToPhase(0.22)).toBe('services');
    expect(progressToPhase(0.54)).toBe('services');
    expect(progressToPhase(0.55)).toBe('gallery');
    expect(progressToPhase(0.84)).toBe('gallery');
    expect(progressToPhase(0.85)).toBe('contact');
    expect(progressToPhase(1)).toBe('contact');
  });
});

describe('buildCameraPath().sample', () => {
  const path = buildCameraPath();

  it('returns the first waypoint FOV at t=0 and the last at t=1', () => {
    expect(path.sample(0).fov).toBeCloseTo(WAYPOINTS[0].fov ?? 42);
    expect(path.sample(1).fov).toBeCloseTo(WAYPOINTS[WAYPOINTS.length - 1].fov ?? 42);
  });

  it('clamps t below 0 and above 1', () => {
    const below = path.sample(-1);
    const at0 = path.sample(0);
    expect(below.fov).toBeCloseTo(at0.fov);

    const above = path.sample(2);
    const at1 = path.sample(1);
    expect(above.fov).toBeCloseTo(at1.fov);
  });

  it('interpolates FOV between flanking waypoints', () => {
    // Midway between waypoint 0 (42) and waypoint 1 (48) is t≈1/6.
    const fov = path.sample(1 / 6).fov;
    expect(fov).toBeGreaterThan(42);
    expect(fov).toBeLessThan(48);
  });

  it('produces finite position and target vectors', () => {
    const { position, target } = path.sample(0.5);
    for (const v of [position, target]) {
      expect(Number.isFinite(v.x)).toBe(true);
      expect(Number.isFinite(v.y)).toBe(true);
      expect(Number.isFinite(v.z)).toBe(true);
    }
  });
});
