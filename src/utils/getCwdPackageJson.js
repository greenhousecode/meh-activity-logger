import { join } from 'path';

export default () => {
  try {
    // Dirty fix for: "'readFileSync' is not exported by node_modules/rollup-plugin-node-builtins/src/es6/empty.js"
    // eslint-disable-next-line global-require
    const contents = require('fs').readFileSync(join(process.cwd(), 'package.json'));
    return JSON.parse(contents);
  } catch (error) {
    return {};
  }
};
