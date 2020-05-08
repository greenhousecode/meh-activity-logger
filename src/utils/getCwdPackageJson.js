import readFileSync from 'fs';
import { join } from 'path';

export default () => {
  try {
    const contents = readFileSync(join(process.cwd(), 'package.json'));
    return JSON.parse(contents);
  } catch (error) {
    return {};
  }
};
