/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 13:04:47 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 14:41:39
 */

const { resolve } = require('path');
const { execSync } = require('child_process');
const { rmdirSync } = require('fs');
const forEachFile = require('./utils/for-each-file.js');

const pkgJSON = require('../package.json');
const tsConfig = require('../tsconfig.json');

const { compilerOptions: { outDir: od }} = tsConfig;
const outDir = resolve(od);

const build = async () => {
  rmdirSync(outDir, { recursive: true });
  
  execSync('tsc --declaration');

  forEachFile(
    outDir, /^[a-zA-Z\-_\.]+\.js$/
  ).replaceAll(
    /import\s+.*\s+from '(?<path>(\..*))';/, (origin, { path }) => {
      if (/\/.*\.(js|json)$/.test(path)) {
        return false;
      }
      return origin.replace(path, `${path}.js`);
    },
    /AUTHOR/, () => `"${pkgJSON.author}"`,
    /VERSION/, () => `"${pkgJSON.version}"`
  );
};

build();
