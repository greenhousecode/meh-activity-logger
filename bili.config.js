import { name } from './package.json';

export default {
  plugins: { 'node-builtins': true },
  output: {
    moduleName: name.replace(/-([^-])/g, ([, match]) => match.toUpperCase()),
    format: ['cjs', 'esm', 'umd-min'],
  },
};
