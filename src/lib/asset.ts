/**
 * Build a runtime URL for a file in `public/`, honouring Vite's
 * `import.meta.env.BASE_URL`. Works at the root (`/`) and any subpath
 * (e.g. GitHub Pages `/repo-name/`).
 *
 *   asset('photos/before-1.webp')  →  './photos/before-1.webp' at root
 *                                  →  '/repo/photos/before-1.webp' on a subpath
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const trimmedBase = base.endsWith('/') ? base : `${base}/`;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${trimmedBase}${trimmedPath}`;
}
