/* eslint-disable id-length */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

// initialize
const init = require('./utils/init');
init('prod');

const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const bfj = require('bfj');
const webpack = require('webpack');
const configFactory = require('./utils/webpackConfigFactory');
const paths = require('../configs/paths.json');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const pkgJson = require('../package.json');

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild
} = FileSizeReporter;

// These sizes are pretty large. We'll warn for bundles exceeding them.
/* eslint-disable no-magic-numbers */
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
/* eslint-enable no-magic-numbers */

const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration
const config = configFactory('production');
const {
  rootDir,
  output,
  publicPath: publicUrl
} = paths;

const outputPath = path.resolve(fs.realpathSync(process.cwd()), rootDir, output);

measureFileSizesBeforeBuild(outputPath).
  then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(outputPath);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  }).
  then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          `\nSearch for the ${ 
            chalk.underline(chalk.yellow('keywords')) 
          } to learn more about each warning.`
        );
        console.log(
          `To ignore, add ${ 
            chalk.cyan('// eslint-disable-next-line') 
          } to the line before.\n`
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        outputPath,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const { publicPath } = config.output.path;
      const buildFolder = path.relative(process.cwd(), outputPath);
      printHostingInstructions(
        pkgJson,
        publicUrl,
        publicPath,
        buildFolder,
        false
      );
    },
    err => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';

      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        );
        printBuildError(err);
      } else {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      }
    }
  ).
  catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
const build = previousFileSizes => {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages = null;

      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Reflect.apply(err, 'postcssNode')) {
          errMessage += `\nCompileError: Begins at CSS selector ${ 
            err.postcssNode.selector
          }`;
        }

        messages = formatWebpackMessages({
          errors:   [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI && (
          typeof process.env.CI !== 'string'
          || process.env.CI.toLowerCase() !== 'false'
        ) && messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n'
              + 'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };

      if (writeStatsJson) {
        return bfj.
          write(`${outputPath}/bundle-stats.json`, stats.toJson()).
          then(() => resolve(resolveArgs)).
          catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
};

const copyPublicFolder = () => {
  fs.copySync(
    path.resolve(fs.realpathSync(process.cwd()), paths.rootDir, 'public'),
    outputPath, {
      dereference: true,
      filter:      file => file !== path.resolve(
        fs.realpathSync(process.cwd()), paths.rootDir, paths.template
      ),
    }
  );
};
