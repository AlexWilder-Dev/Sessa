import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the repository root of the deploy branch, so the build
// is written there (one level up from this app folder). Asset paths are
// relative, so the site works under any repository name.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '..',
    emptyOutDir: false,
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
