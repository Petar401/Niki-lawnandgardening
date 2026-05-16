/**
 * Generate AVIF + WebP variants alongside each project JPEG so the
 * BeforeAfterSlider can serve a smaller payload to modern browsers and
 * small viewports.
 *
 *   <picture>
 *     <source type="image/avif" srcset="foo-800.avif 800w, foo.avif 1200w" sizes="..." />
 *     <source type="image/webp" srcset="foo-800.webp 800w, foo.webp 1200w" sizes="..." />
 *     <img src="foo.jpg" width="1200" height="880" ... />
 *   </picture>
 *
 * Re-run after replacing or re-cropping the source JPEGs:
 *   node scripts/build-image-variants.mjs
 */
import { readdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const DIR = new URL('../public/images/projects/', import.meta.url).pathname;
const SIZES = [800, 1200];
const WEBP_QUALITY = 72;
const AVIF_QUALITY = 50; // AVIF is much better per-bit, lower numbers stay clean

const all = await readdir(DIR);
const sources = all.filter(
  (f) =>
    extname(f) === '.jpg' &&
    !/-\d+\./.test(f), // skip already-sized variants if anyone runs the script twice
);

for (const file of sources) {
  const path = join(DIR, file);
  const stem = basename(file, '.jpg');

  for (const width of SIZES) {
    const webp = join(DIR, `${stem}-${width}.webp`);
    const avif = join(DIR, `${stem}-${width}.avif`);
    await sharp(path).resize({ width }).webp({ quality: WEBP_QUALITY, effort: 5 }).toFile(webp);
    await sharp(path).resize({ width }).avif({ quality: AVIF_QUALITY, effort: 5 }).toFile(avif);

    const w = (await stat(webp)).size;
    const a = (await stat(avif)).size;
    console.log(
      `${stem}-${width}: webp ${(w / 1024).toFixed(0)} KB, avif ${(a / 1024).toFixed(0)} KB`,
    );
  }
}
