"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:31:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-24 01:08:18
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

const fs = require("fs");

const child_process_1 = require("child_process");

const configs = {
  cacheDir: path.resolve(__filename, '..', '..', '..') // FIXME:

}; // ************************************ //
//                 ROOT                 //
// ************************************ //

const locateRoot = (dir = process.cwd()) => {
  const pkgJSON = path.join(dir, 'package.json');

  if (fs.existsSync(pkgJSON)) {
    const data = require(pkgJSON);

    const isRoot = data.private && data.workspaces?.join('|') === 'packages/*';

    if (isRoot) {
      return dir;
    }
  }

  const upper = path.resolve(dir, '..');

  if (upper === dir) {
    // cannot go up
    throw new Error(`Cannot find root package. `);
  }

  return locateRoot(upper);
};
/** Dir of the repo root. */


const rootDir = locateRoot();
/** Package.json config of the repo root. */

const rootPkg = require(path.resolve(rootDir, 'package.json')); // ************************************ //
//                PACKAGE               //
// ************************************ //

/** Names of all packages. */


const packages = fs.readdirSync(path.resolve(rootDir, 'packages'));
/** Package.json mappings for each package. */

const packageMap = Object.fromEntries(packages.map(p => [p, require(path.resolve(rootDir, 'packages', p, 'package.json'))]));

const locatePackage = (dir = process.cwd()) => {
  if (dir === rootDir) {
    // root directory reached
    return undefined;
  }

  const pkgJSON = path.join(dir, 'package.json');

  if (fs.existsSync(pkgJSON)) {
    return dir.split(/[\/\\]/).reverse()[0];
  }

  const upper = path.resolve(dir, '..');
  return locatePackage(upper);
};
/** Current package, if current working directory is in it. */


const currentPackage = locatePackage(); // ************************************ //
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

const env = {
  rootDir,
  rootPkg,
  packages,
  packageMap,
  currentPackage,
  resolvePath,
  resolvePathInPackage,
  runtime: {
    shell: process.platform === 'win32' ? process.env['ComSpec'] || 'cmd' : process.env['SHELL'] || 'sh',
    npm: {
      registry: (() => {
        try {
          return (0, child_process_1.execSync)('npm config get registry', {
            encoding: 'utf-8'
          }).replace(/\n$/, '');
        } catch {
          return 'https://registry.npmjs.org/';
        }
      })()
    },
    node: {
      version: process.version
    }
  },
  configs: configs
};
exports.default = env;