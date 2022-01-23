/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:31:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:33:55
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
  name: string;
  version: string;
  private: boolean;
  workspaces: string[];
  author: PackageAuthor;
  contributors: PackageAuthor[];
  repository: {
    type: 'git';
    url: string;
    directory: string;
  };
  bugs: {
    url: string;
  };
  homepage: string;
  bin: string | {
    [name: string]: string;
  };
  scripts: {
    [script: string]: string;
  };
  license: string;
  peerDependenciesMeta: Record<string, { optional: boolean }>;
  [otherConfig: string]: any;
} & Record<DependencyTag, DependencySet>>;


// ************************************ //
//                 THIS                 //
// ************************************ //

const thisPkg = require('../../package.json') as {
  name: string;
  version: string;
};

// ************************************ //
//                 ROOT                 //
// ************************************ //

const locateRoot = (dir: string = process.cwd()): string | null => {
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
    // cannot find root package
    return null;
  }

  return locateRoot(upper);
};

/** Dir of the repo root. */
const rootDir = locateRoot();

/** Package.json config of the repo root. */
const rootPkg = rootDir ? require(path.resolve(rootDir, 'package.json')) as PackageJSON : null;


// ************************************ //
//                PACKAGE               //
// ************************************ //

/** Names of all packages. */
const packages = rootDir ? fs.readdirSync(path.resolve(rootDir, 'packages')) : null;

/** Package.json mappings for each package. */
const packageMap = rootDir && packages ? Object.fromEntries(
  packages.map(p => [
    p, require(path.resolve(rootDir, 'packages', p, 'package.json')) as PackageJSON
  ])
) : null;

const locatePackage = (dir: string = process.cwd()): string | undefined => {
  if (dir === rootDir || !rootDir) {
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
const resolvePath = (...pathSegments: string[]): string => {
  if (rootDir) {
    return path.resolve(rootDir, ...pathSegments);
  }

  throw new Error(
    `You're outside a espoir workspace.`
  );
};

/**
 * Returns the absolute path relative to the dir of the given package.
 *
 * @param {string} packageName
 * @param {string[]} pathSegments
 * @returns {string}
 */
const resolvePathInPackage = (
  packageName: string, ...pathSegments: string[]
): string => {
  if (rootDir) {
    return path.resolve(rootDir, 'packages', packageName, ...pathSegments);
  }

  throw new Error(
    `You're outside a espoir workspace.`
  );
};


// ************************************ //
//                CONFIGS               //
// ************************************ //

export type EspoirCommitConfigs = {
  /** Types allowed to use */
  types: string[];
  /** Whether this commit can be run without changelog or not */
  optional: boolean;
  /** Valid format of commit message */
  format: string;
  /** Scopes allowed to use */
  scopes?: string[];
  /** Configurations of commit message subject */
  subject: {
    /** Minimum string length */
    min: number;
    /** Maximum string length */
    max: number;
    /** Valid pattern */
    pattern: RegExp;
  };
};

export type EspoirConfigs = {
  cacheDir: string;
  /** Configuration of espoir contribute feature */
  commit: EspoirCommitConfigs;
};

const configFile = rootDir ? [
  'espoir.config.js',
  'espoir.config.json'
].map(fn => path.join(rootDir, fn)).find(fs.existsSync) : undefined;

const configFileData: Partial<EspoirConfigs> = configFile ? require(configFile) : {};

const configs: EspoirConfigs = {
  cacheDir: path.resolve(__filename, '..', '..', '..'), // FIXME:
  commit: {
    types: configFileData.commit?.types ?? [
      'feature',
      'bugfix',
      'refactor',
      'performance',
      'chore'
    ],
    optional: configFileData.commit?.optional ?? false,
    format: configFileData.commit?.format ?? '<type>(<scope?>): <subject>',
    subject: {
      min: configFileData.commit?.subject?.min ?? 4,
      max: configFileData.commit?.subject?.max ?? 40,
      pattern: configFileData.commit?.subject?.pattern ? (
        typeof (configFileData.commit.subject.pattern as string | RegExp) === 'string' ? (
          new RegExp(configFileData.commit.subject.pattern)
        ) : (
          configFileData.commit.subject.pattern
        )
      ) : /^.*$/
    }
  }
};


const env = {
  version: parseInt(thisPkg.version.split('.')[0] as string),
  rootDir,
  rootPkg,
  packages,
  packageMap,
  currentPackage,
  resolvePath,
  resolvePathInPackage,
  runtime: {
    shell:   process.platform === 'win32' ? (process.env['ComSpec'] || 'cmd') : (process.env['SHELL'] || 'sh'),
    espoir: {
      name: thisPkg.name,
      version: thisPkg.version
    },
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
  configs: configs as Readonly<EspoirConfigs>
};


export default env;
