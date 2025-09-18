import {copyFileSync} from 'fs'
import {join} from 'path'
import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    external: ['ws', 'cheerio', 'cookie'],
    noExternal: [],
    splitting: false,
    treeshake: true,
    onSuccess: async () => {
        copyFileSync(
            join(process.cwd(), 'src', 'guard', '_guard_auto.js'),
            join(process.cwd(), 'dist', '_guard_auto.js')
        )
    }
})