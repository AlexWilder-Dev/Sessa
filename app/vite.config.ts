import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the root of the deploy branch, so the build is written
// one level up from this folder. Relative asset paths keep it working under
// any repository name.
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
