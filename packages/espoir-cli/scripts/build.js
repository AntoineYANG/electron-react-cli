/*
 * @Author: Kanata You 
 * @Date: 2021-11-23 21:50:19 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-24 15:56:19
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const babel = require('@babel/core');

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
  try {
    // await tscBuild();
    await resolveTSAliases();
  } catch (error) {
    console.error(error);

    return 1;
  }

  return 0;
};


main().then(process.exit);
