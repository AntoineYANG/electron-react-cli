/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:31:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 23:02:59
 */

import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { DependencySet, DependencyTag } from 'runnable/install/utils/load-dependencies';


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

/** Dir of the repo root. */
const rootDir = path.resolve(__filename, '..', '..', '..');

/** Package.json config of the repo root. */
const rootPkg = require(path.resolve(__filename, '..', '..', '..', 'package.json')) as PackageJSON;


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
