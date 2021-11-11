/*
 * @Author: Kanata You
 * @Date: 2021-11-11 02:38:27
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 02:39:08
 */

const fs = require('fs');
const path = require('path');

/**
 * Gets all files meeting the given pattern.
 *
 * @param {string} __path
 * @param {RegExp|undefined} filter
 * @returns {string[]}
 */
const readDirAll = (__path, filter = /.*/) => {
  if (fs.existsSync(__path)) {
    const files = [];
    const dirs = [];
    fs.readdirSync(__path).forEach(name => {
      const fn = path.join(__path, name);

      if (fs.statSync(fn).isDirectory()) {
        dirs.push(fn);
      } else if (filter.test(name)) {
        files.push(fn);
      }
    });
    dirs.forEach(dir => {
      files.push(...readDirAll(dir, filter));
    });

    return files;
  }

  return [];
};

module.exports = {
  readDirAll,
};
