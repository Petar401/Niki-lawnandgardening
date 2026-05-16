/**
 * Render scripts/og-image.svg to public/og-image.png (1200×630).
 * Run after editing the SVG:
 *   node scripts/build-og-image.mjs
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('./og-image.svg', import.meta.url));
const out = new URL('../public/og-image.png', import.meta.url).pathname;

await sharp(svg).resize(1200, 630).png({ compressionLevel: 9 }).toFile(out);
console.log('wrote', out);
