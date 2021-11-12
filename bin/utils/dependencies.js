/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 16:23:21 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-12 16:59:18
 */

const env = require('./env.js');


class DependentSource {

  /**
   * @type {string}
   * @memberof DependentSource
   */
  name;

  /**
   * Creates an instance of DependentSource.
   * @param {string} name
   * @memberof DependentSource
   */
  constructor(name) {
    this.name = name;
  }

}

/**
 *
 *
 * @returns {{ [key in ('dependencies' | 'devDependencies')]: { [name: string]: { from: string[]; to: string; }[] } }}
 */
const getAllDependencies = () => {
  /** @type {{ [name: string]: { from: string[]; to: string; }[] }} */
  const dependencies = {};
  /** @type {{ [name: string]: { from: string[]; to: string; }[] }} */
  const devDependencies = {};

  // root dir
  if (Object.keys(env.rootPkg.dependencies || {}).length) {
    console.warn(
      '`dependencies` in root `package.json` is found, which is not suggested. '
      + 'Move them to `devDependencies` or any child package instead. '
    );
  }
  Object.entries(env.rootPkg.devDependencies || {}).forEach(([mod, version]) => {
    if (devDependencies[mod] === undefined) {
      devDependencies[mod] = [];
    }
    devDependencies[mod].push({
      from: [new DependentSource('root')],
      to:   version
    });
  });

  return {
    dependencies,
    devDependencies
  };
};


module.exports = {
  DependentSource,
  getAllDependencies
};
