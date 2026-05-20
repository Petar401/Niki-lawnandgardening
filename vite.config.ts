import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
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
