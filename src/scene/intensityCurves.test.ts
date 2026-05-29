import { describe, it, expect } from 'vitest';
import { galleryIntensity } from './gallery/galleryData';
import { contactIntensity } from './contact/contactData';

describe('galleryIntensity', () => {
  it('peaks at its centre (~0.66)', () => {
    expect(galleryIntensity(0.66)).toBeCloseTo(1, 5);
  });

  it('clamps to 0 outside the bell width and never goes negative', () => {
    expect(galleryIntensity(0)).toBe(0);
    expect(galleryIntensity(1)).toBe(0);
    expect(galleryIntensity(0.66)).toBeGreaterThanOrEqual(0);
  });

  it('falls off symmetrically around the centre', () => {
    expect(galleryIntensity(0.56)).toBeCloseTo(galleryIntensity(0.76), 5);
  });
});

describe('contactIntensity', () => {
  it('peaks at its centre (~0.95)', () => {
    expect(contactIntensity(0.95)).toBeCloseTo(1, 5);
  });

  it('clamps to 0 far from the centre', () => {
    expect(contactIntensity(0)).toBe(0);
    expect(contactIntensity(0.95)).toBeGreaterThan(0);
  });
});
