// Removes the previous build from the repository root before a new one, so
// old hashed files don't pile up. Only touches what the build writes.
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
for (const path of ['index.html', 'assets', 'media', 'og.jpg', 'favicon-48.png', 'apple-touch-icon.png']) {
  rmSync(root + path, { recursive: true, force: true });
}
