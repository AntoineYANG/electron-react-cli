/*
 * @Author: Kanata You
 * @Date: 2021-11-11 02:40:19
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 03:15:58
 */

const fs = require('fs');
const path = require('path');

const { readDirAll } = require('./extra-fs.js');

/**
 * Reads the project directory and returns the names of the packages.
 *
 * @returns {string[]}
 */
const getAllPackages = () => fs.readdirSync(path.resolve('packages'));

/**
 * Reads the package directory and returns the names and sizes of the included file.
 *
 * @param {string} name
 *
 * @returns {[string, number][]}
 */
const getIncludedFiles = name => {
  const __path = path.resolve('packages', name);
  const { files = [] } = require(path.resolve(__path, 'package.json'));
  const npmIgnore = path.resolve(__path, '.npmignore');
  const ignored = fs.existsSync(npmIgnore)
    ? fs
      .readFileSync(npmIgnore, { encoding: 'utf-8' })
      .split(/[\n\r]+/)
      .filter(d => d.length)
    : [];

  const isIncluded = fp => {
    // check in `ignored`
    for (let i = 0; i < ignored.length; i += 1) {
      const ign = ignored[i].replace(/\\/g, '/');

      switch (true) {
        case /^\//.test(ign): {
          // package relative path
          const prp = `${ign}/`.replace(/\/{2}$/, '/');

          if (fp.startsWith(prp)) {
            return false;
          }

          break;
        }

        case /[^/*]/.test(ign): {
          // file name
          const fPattern = new RegExp(`/${ign.replace(/\./g, '\\.').replace(/-/g, '-')}`);

          if (fPattern.test(fp)) {
            return false;
          }

          break;
        }

        default: {
          // TODO:
          continue;
        }
      }
    }

    // check if is common file
    for (const file of [
      /\/package\.json$/,
      /\/LICENSE$/,
      /\/README\.md$/,
      /\/CHANGELOG(-\d+\.x)?.md$/
    ]) {
      if (file.test(fp)) {
        return true;
      }
    }

    // check in `files`
    for (let i = 0; i < files.length; i += 1) {
      const icl = files[i].replace(/\\/g, '/');

      switch (true) {
        case /^\//.test(icl): {
          // package relative path
          const prp = `${icl}/`.replace(/\/{2}$/, '/');

          if (fp.startsWith(prp)) {
            return true;
          }

          break;
        }

        case /[^/*]/.test(icl): {
          // file name
          const fPattern = new RegExp(`/${icl.replace(/\./g, '\\.').replace(/-/g, '-')}`);

          if (fPattern.test(fp)) {
            return true;
          }

          break;
        }

        default: {
          // TODO:
          continue;
        }
      }
    }
    return false;
  };
  /** @type {[string, number][]} */
  const stats = [];
  readDirAll(__path).forEach(file => {
    const rp = file.split(__path)[1].replace(/\\/g, '/');

    if (isIncluded(rp)) {
      stats.push([
        rp, fs.statSync(file).size
      ]);
    }
  });
  return stats;
};

module.exports = {
  getAllPackages,
  getIncludedFiles,
};
