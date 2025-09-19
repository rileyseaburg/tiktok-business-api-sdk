import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['@orpc/client', '@orpc/contract', '@orpc/server', '@orpc/zod', 'zod'],
  treeshake: true,
  target: 'es2022',
  outDir: 'dist',
  banner: {
    js: '// TikTok Business API SDK - Generated with ORPC',
  },
})