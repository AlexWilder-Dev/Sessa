// One-off: builds public/og.jpg (1200×630) for link previews from the
// daytime room photo, with the wordmark on a butter-yellow sign in the
// top centre, like a fascia over the windows (square thumbnail crops
// still show it). Run with `npm run og`.
import sharp from 'sharp';
import { statSync } from 'node:fs';

const W = 1200;
const H = 630;
const yellow = { r: 242, g: 213, b: 112 };
const ink = { r: 74, g: 22, b: 22 };

const photo = await sharp('media-src/photo-12.jpg')
  .extract({ left: 0, top: 150, width: 2000, height: 1050 })
  .resize(W, H)
  .modulate({ brightness: 0.92 })
  .toBuffer();

// The sign: a butter-yellow board with the wordmark in the menu ink.
const signW = 500;
const signH = 150;
const markW = signW - 84;
const mark = await sharp('public/media/wordmark.png').resize(markW).toBuffer();
const meta = await sharp(mark).metadata();
const alpha = await sharp(mark).extractChannel('alpha').toBuffer();
const inked = await sharp({
  create: { width: meta.width, height: meta.height, channels: 3, background: ink },
})
  .joinChannel(alpha)
  .png()
  .toBuffer();

const sign = await sharp({
  create: { width: signW, height: signH, channels: 3, background: yellow },
})
  .composite([{ input: inked, gravity: 'center' }])
  .png()
  .toBuffer();

// A hairline steel edge around the sign.
const edge = await sharp({
  create: { width: signW + 6, height: signH + 6, channels: 3, background: { r: 128, g: 131, b: 132 } },
})
  .png()
  .toBuffer();

const left = Math.round((W - signW) / 2);
const top = 44;

await sharp(photo)
  .composite([
    { input: edge, left: left - 3, top: top - 3 },
    { input: sign, left, top },
  ])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile('public/og.jpg');

const out = await sharp('public/og.jpg').metadata();
console.log(`og.jpg ${out.width}×${out.height}, ${Math.round(statSync('public/og.jpg').size / 1024)}KB`);
