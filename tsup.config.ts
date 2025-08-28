import { defineConfig } from 'tsup';
import { copyFileSync } from 'fs';
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'es2020',
  dts: true,
  splitting: false
});