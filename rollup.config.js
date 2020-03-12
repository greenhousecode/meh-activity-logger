import externals from 'rollup-plugin-node-externals';
import { eslint } from 'rollup-plugin-eslint';

import { main, module } from './package.json';

const defaults = {
  input: 'src/main.js',
  plugins: [eslint(), externals({ deps: true })],
};

export default [
  {
    ...defaults,
    output: {
      file: main,
      format: 'cjs',
    },
  },
  {
    ...defaults,
    output: {
      file: module,
      format: 'esm',
    },
  },
];
