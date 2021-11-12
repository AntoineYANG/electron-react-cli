/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:31:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-12 16:11:21
 */

const path = require('path');
const fs = require('fs');


// ************************************ //
//                 ROOT                 //
// ************************************ //

/** Dir of the repo root. */
const rootDir = path.resolve(__filename, '..', '..', '..');

/** Package.json config of the repo root. */
const rootPkg = require(path.resolve(__filename, '..', '..', '..', 'package.json'));


// ************************************ //
//                PACKAGE               //
// ************************************ //

/** Names of all packages. */
const packages = fs.readdirSync(path.resolve(rootDir, 'packages'));

/** Package.json mappings for each package. */
const packageMap = Object.fromEntries(
  packages.map(p => [p, require(path.resolve(rootDir, 'packages', p, 'package.json'))])
);


// ************************************ //
//                METHODS               //
// ************************************ //

/**
 * Returns the absolute path relative to the dir of the root.
 *
 * @param {string[]} pathSegments
 * @returns {string}
 */
const resolvePath = (...pathSegments) => path.resolve(rootDir, ...pathSegments);

/**
 * Returns the absolute path relative to the dir of the given package.
 *
 * @param {string} packageName
 * @param {string[]} pathSegments
 * @returns {string}
 */
const resolvePathInPackage = (packageName, ...pathSegments) => path.resolve(rootDir, 'packages', packageName, ...pathSegments);


module.exports = {
  rootDir,
  rootPkg,
  packages,
  packageMap,
  resolvePath,
  resolvePathInPackage
};
