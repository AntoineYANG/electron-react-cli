/*
 * @Author: Kanata You 
 * @Date: 2021-11-23 21:50:19 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-02-06 12:55:11
 */

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const __package = path.resolve(__dirname, '..');
const tsConfig = require('../tsconfig.json');
const output = path.resolve(__package, tsConfig.compilerOptions.outDir);


const getAllOutputFiles = (dir = output) => {
  const files = [];

  fs.readdirSync(dir).forEach(fn => {
    const fp = path.join(dir, fn);

    if (fs.statSync(fp).isDirectory()) {
      files.push(...getAllOutputFiles(fp));
    } else if (fn.match(/\.js$/)) {
      files.push(fp);
    }
  });

  return files;
};

const resolveTSAliases = async () => {
  const files = getAllOutputFiles();
  
  for (const file of files) {
    const res = await babel.transformFileAsync(
      file, {
        configFile: path.join(__package, 'configs', '.babelrc.js')
      }
    );

    if (res.code) {
      fs.writeFileSync(file, res.code, {
        encoding: 'utf-8'
      });
    }
  }
};

const main = async () => {
  let code = 1;

  [false, true].forEach(throws => {
    try {
      await resolveTSAliases();
      code = 0;
    } catch (error) {
      if (throws) {
        console.error(error);
      }
    }
  });

  return code;
};


main().then(process.exit);
