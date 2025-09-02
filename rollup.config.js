import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import inject from '@rollup/plugin-inject';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'Itdog',
      sourcemap: true,
      globals: {
        crypto: 'crypto'
      }
    }
  ],
  plugins: [
    inject({
      crypto: 'crypto'
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    resolve({
      browser: true
    }),
    commonjs(),
    json()
  ],
  external: []
};