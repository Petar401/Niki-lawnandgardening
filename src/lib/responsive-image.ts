/**
 * Build the srcset string for a project photo's WebP / AVIF variants.
 * Conventions:
 *   - source JPEG lives at  /images/projects/<stem>.jpg
 *   - variants live at      /images/projects/<stem>-800.<ext>
 *                           /images/projects/<stem>-1200.<ext>
 *
 * Re-run scripts/build-image-variants.mjs after changing source images.
 */
export function variantSrcSet(jpgPath: string, format: 'avif' | 'webp'): string {
  const stem = jpgPath.replace(/\.jpg$/, '');
  return `${stem}-800.${format} 800w, ${stem}-1200.${format} 1200w`;
}

/**
 * sizes attribute for project photos in the slider.
 * Mobile + tablet: full container width.
 * Desktop (lg): two-column grid → ~600px per slider.
 */
export const projectImageSizes = '(min-width: 1024px) 600px, 100vw';
