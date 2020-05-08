import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
// import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

import { name as pkgName, main, browser, module, dependencies } from './package.json';

const name = pkgName.replace(/-([^-])/g, ([, match]) => match.toUpperCase());
const external = [...Object.keys(dependencies), 'fs', 'path'];

export default [
  {
    input: 'src/node.js',
    plugins: [eslint(), json()],
    external,
    output: {
      file: main,
      format: 'cjs',
    },
  },
  {
    input: 'src/browser.js',
    plugins: [eslint(), json(), resolve(), commonjs(), babel()],
    output: {
      name,
      file: browser,
      format: 'iife',
    },
  },
  {
    input: 'src/node.js',
    plugins: [eslint(), json()],
    external,
    output: {
      file: module,
      format: 'esm',
    },
  },
];
