import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { base64 } from 'rollup-plugin-base64';
import typescript from '@rollup/plugin-typescript';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/main.ts',
  output: {
    //file: 'main.js',
    dir: '.',
    sourcemap: 'inline',
    format: 'cjs',
    exports: 'default',
  },
  external: ['obsidian', 'React', 'ReactDOM', 'path', 'fs'],
  plugins: [
      replace({
        delimiters: ['', ''],
      }),
    nodeResolve({ browser: true }),
    commonjs({ ignore: ['original-fs'] }),
    base64({ include: "**/*.wasm" }),
    typescript(),
    webWorkerLoader({
      targetPlatform: 'browser',
      extensions: ['.ts'],
      preserveSource: true,
      sourcemap: true,
    }),
  ]
};