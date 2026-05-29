/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Relative base so the build works at the root OR under any subpath
  // (e.g. GitHub Pages /repo-name/). All emitted asset URLs become
  // relative; runtime asset URLs use import.meta.env.BASE_URL via
  // src/lib/asset.ts.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split the heavy 3D libraries into their own chunks so the initial
        // critical path (React + UI) stays light. Browsers can fetch the
        // 3D chunks in parallel and cache them long-term across deploys.
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber'],
          drei: ['@react-three/drei'],
          post: ['@react-three/postprocessing', 'postprocessing'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
