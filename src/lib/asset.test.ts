import { describe, it, expect, afterEach, vi } from 'vitest';
import { asset } from './asset';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('asset', () => {
  it('resolves against the root base by default', () => {
    expect(asset('photos/before-1.webp')).toBe('/photos/before-1.webp');
  });

  it('strips a leading slash from the path so it never doubles up', () => {
    expect(asset('/photos/after-1.webp')).toBe('/photos/after-1.webp');
  });

  it('honours a subpath base (e.g. GitHub Pages /repo/)', () => {
    vi.stubEnv('BASE_URL', '/repo/');
    expect(asset('photos/x.webp')).toBe('/repo/photos/x.webp');
  });

  it('adds a trailing slash to the base when missing', () => {
    vi.stubEnv('BASE_URL', '/repo');
    expect(asset('photos/x.webp')).toBe('/repo/photos/x.webp');
  });
});
