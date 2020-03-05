import { eslint } from 'rollup-plugin-eslint';
import { main, module } from './package.json';

export default [
  {
    input: 'src/main.js',
    plugins: [eslint()],
    output: {
      file: main,
      format: 'cjs',
    },
  },
  {
    input: 'src/main.js',
    output: {
      file: module,
      format: 'esm',
    },
  },
];
