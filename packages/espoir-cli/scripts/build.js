/*
 * @Author: Kanata You 
 * @Date: 2021-11-23 21:50:19 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-30 18:21:58
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const __package = path.resolve(__dirname, '..');
const tsConfig = require('../tsconfig.json');
const output = path.resolve(__package, tsConfig.compilerOptions.outDir);


const tscBuild = () => new Promise(resolve => {
  exec('npx tsc', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    if (stderr) {
      console.error(stderr);
      process.exit(2);
    }

    console.log(stdout);
    resolve();
  });
});

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

const main = async () => {
  try {
    await tscBuild();
  } catch (error) {
    console.error(error);

    return 1;
  }

  return 0;
};


main().then(process.exit);
