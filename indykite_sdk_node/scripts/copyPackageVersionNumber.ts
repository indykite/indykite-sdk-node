import * as fs from 'fs';
import * as path from 'path';

const ROOT_PATH = path.dirname(__dirname);
const PACKAGE_JSON_PATH = path.join(ROOT_PATH, 'package.json');
const VERSION_CONST_PATH = path.join(ROOT_PATH, 'src', 'version.ts');

const removeLineComments = (text: string): string => {
  return text.replace(/\n(([^"]|("[^"]*"))*)\/\/.*\n/g, '\n$1\n');
};

const getPackageJson = () => {
  return JSON.parse(removeLineComments(fs.readFileSync(PACKAGE_JSON_PATH).toString('utf-8')));
};

const exportCommand = `export const LIB_VERSION = '${getPackageJson().version}';\n`;
fs.writeFileSync(VERSION_CONST_PATH, exportCommand);
