import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';

// Node.js built-in modules that should be treated as external
const nodeBuiltins=[
    'crypto', 'http', 'https', 'net', 'tls', 'stream', 'url', 'zlib', 'events',
    'buffer', 'string_decoder', 'node:stream', 'node:assert', 'node:net',
    'node:http', 'node:querystring', 'node:events', 'node:diagnostics_channel',
    'node:util', 'node:tls', 'node:buffer', 'node:zlib', 'node:perf_hooks',
    'node:util/types', 'node:worker_threads', 'node:async_hooks', 'node:console',
    'node:fs/promises', 'node:path', 'node:timers', 'node:dns', 'node:sqlite'
];

export default [
    // CommonJS and ES Module builds (for Node.js)
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.cjs',
                format: 'cjs',
                sourcemap: true,
                exports: 'named'
            },
            {
                file: 'dist/index.mjs',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'dist'
            }),
            resolve({
                browser: false,
                preferBuiltins: true
            }),
            commonjs(),
            json()
        ],
        external: (id) => {
            // Mark Node.js built-ins and main dependencies as external
            return nodeBuiltins.includes(id) ||
                ['ws', 'cheerio'].includes(id) ||
                id.startsWith('node:');
        }
    },
    // UMD build (for browsers - with warnings suppressed)
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'Itdog',
            sourcemap: true,
            globals: {
                'crypto': 'crypto',
                'ws': 'WebSocket',
                'cheerio': 'cheerio'
            }
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json'
            }),
            resolve({
                browser: true,
                preferBuiltins: false
            }),
            commonjs(),
            json()
        ],
        external: ['ws', 'cheerio'],
        onwarn(warning, warn) {
            // Suppress warnings about Node.js built-ins for UMD build
            if (warning.code === 'MISSING_NODE_BUILTINS' ||
                warning.code === 'MISSING_GLOBAL_NAME' ||
                warning.code === 'UNRESOLVED_IMPORT') {
                return;
            }
            warn(warning);
        }
    },
    // Type definitions
    {
        input: 'src/index.ts',
        output: [{file: 'dist/index.d.ts', format: 'es'}],
        plugins: [
            dts(),
            del({
                targets: ['dist/**/*.d.ts', '!dist/index.d.ts'],
                hook: 'buildEnd'
            })
        ],
        external: (id) => {
            return nodeBuiltins.includes(id) ||
                ['ws', 'cheerio'].includes(id) ||
                id.startsWith('node:');
        }
    }
];