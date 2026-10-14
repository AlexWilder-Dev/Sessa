// Builds public/og.jpg (1200×630, for link previews) from the room by day,
// with their wordmark in butter, centred so square thumbnails still show it.
import sharp from 'sharp';
import { statSync } from 'node:fs';
import { chdir } from 'node:process';
import { fileURLToPath } from 'node:url';

chdir(fileURLToPath(new URL('..', import.meta.url)));
const W = 1200;
const H = 630;

const photo = await sharp('media-src/photo-12.jpg')
  .extract({ left: 0, top: 160, width: 2000, height: 1050 })
  .resize(W, H)
  .modulate({ brightness: 0.78, saturation: 0.95 })
  .toBuffer();

// A soft dark pool behind the wordmark so the butter reads.
const shade = Buffer.from(
  `<svg width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="54%" r="55%">` +
    `<stop offset="0" stop-color="#1a0804" stop-opacity="0.55"/><stop offset="1" stop-color="#1a0804" stop-opacity="0"/>` +
    `</radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);

const markW = 640;
const mark = await sharp('public/media/wordmark.png').resize(markW).toBuffer();
const meta = await sharp(mark).metadata();
const alpha = await sharp(mark).extractChannel('alpha').toBuffer();
const butter = await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: { r: 252, g: 229, b: 173 } } })
  .joinChannel(alpha)
  .png()
  .toBuffer();

await sharp(photo)
  .composite([
    { input: shade, left: 0, top: 0 },
    { input: butter, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) },
  ])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile('public/og.jpg');

const out = await sharp('public/og.jpg').metadata();
console.log(`og.jpg ${out.width}×${out.height}, ${Math.round(statSync('public/og.jpg').size / 1024)}KB`);
