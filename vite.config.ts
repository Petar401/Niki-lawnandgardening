import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    // The 3D scene chunk pulls in three.js + r3f + drei. It is lazy-loaded
    // and only fires once the hero is in view, so the size is intentional
    // and should not pollute the build output with a warning.
    chunkSizeWarningLimit: 1000,
  },
});
