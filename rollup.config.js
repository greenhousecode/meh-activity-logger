import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

import { name as pkgName, main, browser /* , module, dependencies */ } from './package.json';

const name = pkgName.replace(/-([^-])/g, ([, match]) => match.toUpperCase());

export default [
  {
    input: 'src/main.js',
    plugins: [eslint(), json(), resolve(), commonjs(), babel()],
    output: {
      name,
      file: main,
      format: 'cjs',
    },
  },
  {
    input: 'src/main.js',
    plugins: [eslint(), json(), resolve(), commonjs(), babel()],
    output: {
      name,
      file: browser,
      format: 'iife',
    },
  },
  // {
  //   input: 'src/main.js',
  //   plugins: [eslint()],
  //   external: Object.keys(dependencies),
  //   output: {
  //     file: module,
  //     format: 'esm',
  //   },
  // },
];
