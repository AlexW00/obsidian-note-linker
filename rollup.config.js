import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { base64 } from 'rollup-plugin-base64';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'main.js',
    //dir: "dist",
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default',
  },
  external: ['obsidian', 'React', 'ReactDOM'],
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    base64({ include: "**/*.wasm" }),
    typescript(),
  ]
};