import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // three / r3f / postprocessing are only reached through dynamic import(),
        // so Rollup keeps them out of the first-paint bundle automatically.
        manualChunks: {
          motion: ['gsap', 'lenis', 'framer-motion'],
        },
      },
    },
  },
});
