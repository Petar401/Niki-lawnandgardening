/**
 * One-off script: crop the BEFORE/AFTER overlay text out of the source
 * project photos in public/images/projects/.
 *
 * The originals had labels burned into the top and bottom edges. We crop
 * the same amount from top and bottom of every photo so the framing stays
 * consistent across the before/after pair and across projects.
 *
 * Run after replacing project photos with new originals:
 *   node scripts/crop-project-photos.mjs
 */
import { readdir, copyFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import sharp from 'sharp';

const DIR = new URL('../public/images/projects/', import.meta.url).pathname;
const TOP_CROP = 0.25; // 25% off the top — covers the large "AFTER" overlays
const BOTTOM_CROP = 0.2; // 20% off the bottom — covers the "BEFORE" overlays

const files = (await readdir(DIR)).filter((f) => f.endsWith('.jpg'));

for (const file of files) {
  const path = join(DIR, file);
  const { width, height } = await sharp(path).metadata();
  if (!width || !height) {
    console.warn(`Skipping ${file} — no metadata`);
    continue;
  }
  const top = Math.round(height * TOP_CROP);
  const cropHeight = Math.round(height * (1 - TOP_CROP - BOTTOM_CROP));

  // Save next to original with .cropped.jpg, then atomically replace.
  const tmp = path + '.tmp.jpg';
  await sharp(path)
    .extract({ left: 0, top, width, height: cropHeight })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(tmp);
  await copyFile(tmp, path);
  await (await import('node:fs/promises')).unlink(tmp);
  console.log(`cropped ${basename(file)}: ${width}×${height} -> ${width}×${cropHeight}`);
}
