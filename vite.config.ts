import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

// Plugin to copy manifest.json and public assets to dist
function copyAssets() {
  return {
    name: 'copy-assets',
    closeBundle() {
      // Copy manifest
      copyFileSync('public/manifest.json', 'dist/manifest.json');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyAssets()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  publicDir: 'public',
});
