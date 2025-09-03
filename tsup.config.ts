import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    external: ['ws', 'cheerio'],
    treeshake: true,
    minify: false,
    target: 'node16',
    bundle: true,
    skipNodeModulesBundle: true
})