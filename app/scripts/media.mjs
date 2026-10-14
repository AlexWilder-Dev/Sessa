// Prepares the site's images from app/media-src into app/public:
// wordmark masks, resized photographs and the favicons.
import sharp from 'sharp';
import { chdir } from 'node:process';
import { fileURLToPath } from 'node:url';

chdir(fileURLToPath(new URL('..', import.meta.url)));
const src = 'media-src';
const out = 'public/media';

// Their wordmark, trimmed tight so CSS can recolour it through a mask.
await sharp(`${src}/logo.png`).trim({ threshold: 1 }).toFile(`${out}/wordmark.png`);
await sharp(`${src}/logo-alt.png`).trim({ threshold: 1 }).toFile(`${out}/wordmark-small.png`);

const photos = [
  ['photo-12', 'room-day', [1600, 900]],
  ['cw-1', 'martini', [1600, 900]],
  ['cw-11', 'lunch', [1200, 700]],
  ['cw-4', 'bar-afternoon', [1200, 700]],
  ['cw-7', 'dinner', [1200, 700]],
  ['cw-8', 'saucisson', [1200, 700]],
  ['cw-6', 'grating', [1200, 700]],
  ['cw-13', 'kitchen', [1200, 700]],
  ['cw-3', 'salad', [1200, 700]],
  ['photo-1', 'window-night', [860]],
  ['photo-5', 'martini-bar', [860]],
  ['photo-8', 'room-evening', [860]],
  ['photo-6', 'chalkboard', [860]],
  ['photo-7', 'shelf', [860]],
  ['team', 'team', [860]],
  ['quince', 'quince', [1100]],
];
for (const [from, name, widths] of photos) {
  for (const w of widths) {
    await sharp(`${src}/${from}.jpg`)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toFile(`${out}/${name}-${w}.jpg`);
  }
}

// Favicons: the first "s" of the wordmark, butter on oxblood.
const crop = await sharp(`${src}/logo.png`).extract({ left: 160, top: 300, width: 184, height: 268 }).png().toBuffer();
const s = await sharp(crop).trim({ threshold: 1 }).toBuffer();
const butter = { r: 252, g: 229, b: 173 };
const ink = { r: 69, g: 11, b: 13, alpha: 1 };
async function icon(size, file, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const glyph = await sharp(s).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  const meta = await sharp(glyph).metadata();
  const alpha = await sharp(glyph).extractChannel('alpha').toBuffer();
  const tinted = await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: butter } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: ink } })
    .composite([{ input: tinted, gravity: 'center' }])
    .png()
    .toFile(file);
}
await icon(48, 'public/favicon-48.png', 0.16);
await icon(180, 'public/apple-touch-icon.png', 0.22);
console.log('media ready');
