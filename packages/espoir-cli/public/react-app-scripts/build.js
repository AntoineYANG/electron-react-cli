/*
 * @Author: Kanata You 
 * @Date: 2022-01-24 15:46:57 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-24 23:17:21
 */
'use strict';

// initialize
const init = require('./utils/init');
init('prod');

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = require('react-dev-utils/FileSizeReporter');
const env = require('espoir-cli/env').default;

const copyPublicDir = require('./utils/copy-public-dir');
const useWebpackConfig = require('./utils/use-webpack-config');
const printWebpackErrors = require('./utils/print-webpack-errors');

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;


const { name: appName } = require('../package.json');
const paths = require('../configs/path.json');

const dir = env.resolvePathInPackage(appName, paths.rootDir);
const outputPath = env.resolvePathInPackage(appName, paths.rootDir, paths.output);

const prepareOutputDir = async () => {
  // clear output directory
  fs.emptyDirSync(outputPath);

  const size = await measureFileSizesBeforeBuild(outputPath);

  // merge public dir
  const publicPath = path.resolve(dir, paths.publicPath);
  copyPublicDir(publicPath, path.join(outputPath, paths.referencePath), path.join(dir, paths.template));

  return size;
};

const runBuild = async prevSize => {
  const config = useWebpackConfig('production');
  
  console.log('Start building...');

  const compiler = webpack(config);

  await new Promise((resolve, reject) => {
    compiler.run(async (err, result) => {
      if (err) {
        return reject(err);
      } else if (result.hasErrors()) {
        await printWebpackErrors(result.compilation.errors);

        return reject(new Error(
          `${
            result.compilation.errors.length
          } error${
            result.compilation.errors.length > 1 ? 's' : ''
          } occurred when running compilation.`
        ));
      } else if (result.hasWarnings()) {
        console.log('Completed with warnings.');

        await printWebpackErrors(result.compilation.warnings, 'warning');
      } else {
        console.log('Completed.');
      }

      console.log(`\nTotal cost: ${(
        (result.endTime - result.startTime) / 1000
      ).toFixed(1)}s`);

      console.log('\nFile sizes after gzip:');

      printFileSizesAfterBuild(
        result,
        prevSize,
        outputPath,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );

      console.log(`\nRun \`serve ${paths.output}\` to start server.`);

      resolve();
    });
  });

  console.log();
};


const webpackBuild = async () => {
  const prevSize = await prepareOutputDir();

  await runBuild(prevSize);

  return 0;
};


if (require.main === module) {
  webpackBuild().then(process.exit);
}


module.exports = webpackBuild;
