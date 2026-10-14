// Clears the previous build out of the repository root (and nothing else).
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
for (const path of ['index.html', 'assets', 'media', 'og.jpg', 'favicon-48.png', 'apple-touch-icon.png']) {
  rmSync(root + path, { recursive: true, force: true });
}
