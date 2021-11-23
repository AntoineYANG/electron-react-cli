/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:31:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-24 01:08:18
 */

import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { DependencySet, DependencyTag } from '@@install/utils/load-dependencies';


export type PackageAuthor = string | Partial<{
  name: string;
  email: string;
  url: string;
}>;

export type PackageJSON = Partial<{
  private: boolean;
  workspaces: string[];
  author: PackageAuthor;
  contributors: PackageAuthor[];
  scripts: {
    [script: string]: string;
  };
  license: string;
  [otherConfig: string]: any;
} & Record<DependencyTag, DependencySet>>;

// ************************************ //
//                CONFIGS               //
// ************************************ //

export type EnvConfigs = {
  cacheDir: string;
};

const configs: EnvConfigs = {
  cacheDir: path.resolve(__filename, '..', '..', '..'), // FIXME:
};

// ************************************ //
//                 ROOT                 //
// ************************************ //

const locateRoot = (dir: string = process.cwd()): string => {
  const pkgJSON = path.join(dir, 'package.json');
  
  if (fs.existsSync(pkgJSON)) {
    const data = require(pkgJSON) as PackageJSON;
    const isRoot = data.private && data.workspaces?.join('|') === 'packages/*';

    if (isRoot) {
      return dir;
    }
  }

  const upper = path.resolve(dir, '..');

  if (upper === dir) {
    // cannot go up
    throw new Error(
      `Cannot find root package. `
    );
  }

  return locateRoot(upper);
};

/** Dir of the repo root. */
const rootDir = locateRoot();

/** Package.json config of the repo root. */
const rootPkg = require(path.resolve(rootDir, 'package.json')) as PackageJSON;


// ************************************ //
//                PACKAGE               //
// ************************************ //

/** Names of all packages. */
const packages = fs.readdirSync(path.resolve(rootDir, 'packages'));

/** Package.json mappings for each package. */
const packageMap = Object.fromEntries(
  packages.map(p => [
    p, require(path.resolve(rootDir, 'packages', p, 'package.json')) as PackageJSON
  ])
);

const locatePackage = (dir: string = process.cwd()): string | undefined => {
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
const currentPackage = locatePackage();


// ************************************ //
//                METHODS               //
// ************************************ //

/**
 * Returns the absolute path relative to the dir of the root.
 *
 * @param {string[]} pathSegments
 * @returns {string}
 */
const resolvePath = (...pathSegments: string[]): string => path.resolve(rootDir, ...pathSegments);

/**
 * Returns the absolute path relative to the dir of the given package.
 *
 * @param {string} packageName
 * @param {string[]} pathSegments
 * @returns {string}
 */
const resolvePathInPackage = (
  packageName: string, ...pathSegments: string[]
): string => path.resolve(rootDir, 'packages', packageName, ...pathSegments);


const env = {
  rootDir,
  rootPkg,
  packages,
  packageMap,
  currentPackage,
  resolvePath,
  resolvePathInPackage,
  runtime: {
    shell:   process.platform === 'win32' ? (process.env['ComSpec'] || 'cmd') : (process.env['SHELL'] || 'sh'),
    npm: {
      registry: (() => {
        try {
          return execSync('npm config get registry', { encoding: 'utf-8' }).replace(/\n$/, '');
        } catch {
          return 'https://registry.npmjs.org/';
        }
      })()
    },
    node: {
      version: process.version
    }
  },
  configs: configs as Readonly<EnvConfigs>
};


export default env;
