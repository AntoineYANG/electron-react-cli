/*
 * @Author: Kanata You
 * @Date: 2021-11-10 21:39:33
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 03:26:38
 */

// # ************************************
// # This builds the included packages.
// # ************************************

/* eslint-disable guard-for-in */

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

const { formattedSize, formattedTime } = require('./utils/formatters.js');
const { getAllPackages, getIncludedFiles } = require('./utils/package.js');
const { StopWatch } = require('./utils/performance.js');

const separatorLen = 24;

/**
 * Triggers [build] scripts for packages.
 */
const build = async () => {
  const timer = new StopWatch('Task [build]');

  const packages = getAllPackages();
  console.log(`\n${'='.repeat(separatorLen)}`);
  console.log(chalk`{greenBright.bold ${packages.length}} packages to build`);
  packages.forEach(name => {
    console.log(chalk`  {green.bold * ${name}}`);
  });
  console.log(`${'='.repeat(separatorLen)}\n`);

  for (const i of packages.map((_, j) => j)) {
    const name = packages[i];

    console.log('-'.repeat(separatorLen));
    console.log(chalk`{blueBright [${i + 1}/${packages.length}] Start building {green.bold ${name}}}`);

    const __path = path.resolve('packages', name);
    /** @type {import('webpack').Configuration} */
    const buildConfig = require(path.resolve(__path, 'config', 'webpack.config.js'));

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve, reject) => {
      const compiler = webpack(buildConfig);
      compiler.run((err, stats) => {
        if (err) {
          reject(err.message ?? 'Uncaught error');
          return;
        }
        if (stats.compilation.errors.length) {
          console.log();
          stats.compilation.errors.forEach(cplErr => {
            console.error(chalk.redBright(cplErr));
          });
          reject(new Error('Error occurred while compiling'));
          return;
        }
        let left = 1;
        /** @type {[string, number][]} */
        const output = [];

        for (const file in stats.compilation.assets) {
          // file may be the declaration file or output in 'bin/'
          const fp = /^\.{2}\/lib\/.+\.d\.ts$/.test(file) ? file.slice(3) : `bin/${file}`;

          if (fp.length > left) {
            left = fp.length;
          }
          const size = stats.compilation.assets[file].size();
          output.push([
            fp, size
          ]);
        }
        output
          .sort((a, b) => {
            for (let i = 0; i < a.length && i < b.length; i += 1) {
              const diff = a[0].charCodeAt(i) - b[0].charCodeAt(i);

              if (diff) {
                return diff;
              }
            }
            return a.length - b.length;
          })
          .forEach(([
            fp, size
          ]) => {
            console.log(
              chalk` {green +} {green '${fp}'}${' '.repeat(left - fp.length + 1)}{yellow ${formattedSize(size)}}`
            );
          });
        const time = (stats.endTime - stats.startTime) / 1000;
        console.log(chalk`  Finished in {yellow ${formattedTime(time)}}`);
        resolve(true);
      });
    });

    console.log('-'.repeat(separatorLen));
  }

  console.log(`\n${'='.repeat(separatorLen)}`);
  console.log(chalk`{greenBright.bold ${packages.length}} {blueBright packages built successfully}`);

  /** @type {[string, number][]} */
  const packageStats = [];
  let left = 1;

  packages.forEach(name => {
    if (name.length > left) {
      left = name.length;
    }
    const dir = getIncludedFiles(name);
    const size = dir.reduce((prev, cur) => prev + cur[1], 0);
    packageStats.push([
      name, size
    ]);
  });

  packageStats.forEach(([
    name, size
  ]) => {
    console.log(chalk`{green >>> {bold ${name}}}${' '.repeat(left - name.length + 1)}{yellow ${formattedSize(size)}}`);
  });

  timer.log();

  console.log(`${'='.repeat(separatorLen)}\n`);
};

build();

// cross-env NODE_ENV=production npx webpack
