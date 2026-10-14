// One-off: trims the logo marks into mask images, resizes the painting and
// the hero photo, and makes the favicons. Run with `npm run media`.
import sharp from 'sharp';

const src = 'media-src';
const dir = 'public/media';

// Wordmarks, trimmed tight so they can be used as CSS masks.
await sharp(`${src}/logo.png`).trim({ threshold: 1 }).toFile(`${dir}/wordmark.png`);
await sharp(`${src}/logo-alt.png`).trim({ threshold: 1 }).toFile(`${dir}/wordmark-clean.png`);

// The quince painting, at a size the page actually needs.
await sharp(`${src}/quince.jpg`)
  .resize(1100)
  .jpeg({ quality: 80, progressive: true, mozjpeg: true })
  .toFile(`${dir}/quince-1100.jpg`);

// The daytime room photo in two widths.
for (const w of [1000, 1600]) {
  await sharp(`${src}/photo-12.jpg`)
    .resize(w)
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toFile(`${dir}/room-day-${w}.jpg`);
}

// Favicons: the first "s" of the wordmark, oxblood on butter yellow.
const yellow = '#F2D570';
const ink = { r: 74, g: 22, b: 22, alpha: 1 };
const sCrop = await sharp(`${src}/logo.png`)
  .extract({ left: 160, top: 300, width: 184, height: 268 })
  .png()
  .toBuffer();
const s = await sharp(sCrop).trim({ threshold: 1 }).toBuffer();

async function icon(size, file, pad) {
  const inner = Math.round(size * (1 - pad * 2));
  const glyph = await sharp(s)
    .resize({ width: inner, height: inner, fit: 'inside' })
    .toBuffer();
  // Recolour the glyph with the ink colour, keeping its alpha.
  const meta = await sharp(glyph).metadata();
  const alpha = await sharp(glyph).extractChannel('alpha').toBuffer();
  const tinted = await sharp({
    create: { width: meta.width, height: meta.height, channels: 3, background: ink },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: yellow } })
    .composite([{ input: tinted, gravity: 'center' }])
    .png()
    .toFile(file);
}

await icon(48, 'public/favicon-48.png', 0.14);
await icon(180, 'public/apple-touch-icon.png', 0.2);
console.log('media ready');
