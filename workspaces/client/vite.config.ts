import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';

const plugins: PluginOption[] = [react(), tailwindcss()];
if (process.env['VITE_ANALYZE'] === 'true') {
  plugins.push(visualizer() as PluginOption);
}

export default defineConfig({
  base: '/public/',
  build: {
    rollupOptions: {
      input: { main: path.resolve(import.meta.dirname, 'src/main.tsx') },
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: 'chunk-[hash].js',
        dir: 'dist',
        entryFileNames: 'main.js',
      },
    },
    sourcemap: true,
  },
  define: {
    "process.env['API_BASE_URL']": JSON.stringify(process.env['API_BASE_URL'] ?? '/api'),
  },
  mode: 'production',
  plugins,
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
  },
});
