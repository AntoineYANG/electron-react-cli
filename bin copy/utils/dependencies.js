/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 16:23:21 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 01:02:17
 */

const env = require('./env.js');
const {
  getAllDependenciesInRoot,
  getAllDependenciesInPackage,
  concatDependencies
} = require('./deps/get-deps.js');


/**
 * Analyzes the dependencies of the root and the packages.
 *
 * @param {import('../../scripts/node-package').InstallOptions} options install options
 * @returns {import('./deps/dependencies').AllDependencies}
 */
const getAllDependencies = options => {
  const rootDeps = getAllDependenciesInRoot(options);
  const packageDeps = env.packages.map(name => {
    const package = env.packageMap[name];

    return getAllDependenciesInPackage(name, package, options);
  });
  
  const fs = require('fs');
  fs.writeFileSync(
    './bin/utils/deps/memo.json',
    JSON.stringify(
      concatDependencies(rootDeps, ...packageDeps),
      undefined,
      2
    ), {
      encoding: 'utf-8'
    }
  );
  return concatDependencies(rootDeps, ...packageDeps);
};


module.exports = {
  getAllDependencies
};
