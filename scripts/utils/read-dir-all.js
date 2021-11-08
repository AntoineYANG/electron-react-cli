/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 13:18:01 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-08 21:54:36
 */

const { readdirSync, existsSync, statSync } = require('fs');
const { join } = require('path');

/**
 * Gets all files meeting the given pattern.
 *
 * @param {string} path
 * @param {RegExp|undefined} filter
 * @returns {string[]}
 */
const readDirAll = (path, filter = /.*/) => {
  if (existsSync(path)) {
    const files = [];
    const dirs = [];
    readdirSync(path).forEach(name => {
      const fn = join(path, name);
      if (statSync(fn).isDirectory()) {
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


module.exports = readDirAll;
