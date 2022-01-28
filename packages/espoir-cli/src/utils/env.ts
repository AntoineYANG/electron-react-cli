/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:31:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:24:05
 */

import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { DependencySet, DependencyTag } from '@@install/utils/load-dependencies';
import lazyReadonly, { lazyUpdate } from '@lazy';


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

const locatePackage = (rootDir: string | null, dir: string = process.cwd()): string | undefined => {
  if (dir === rootDir || !rootDir) {
    // root directory reached
    return undefined;
  }

  const pkgJSON = path.join(dir, 'package.json');
  
  if (fs.existsSync(pkgJSON)) {
    return dir.split(/[\/\\]/).reverse()[0];
  }

  const upper = path.resolve(dir, '..');

  return locatePackage(rootDir, upper);
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

export type EspoirEnv = Readonly<{
  /** major version of espoir-cli */
  version: number;
  /** absolute directory of the current monorepo */
  rootDir: string | null;
  /** data of package.json of the current monorepo */
  rootPkg: PackageJSON | null;
  /** names of all the packages in the current monorepo */
  packages: string[] | null;
  /** map of data of package.json for each package in the current monorepo */
  packageMap : Record<string, PackageJSON> | null;
  /** name of the current package */
  currentPackage: string | null;
  /** resolves an absolute path from a relative directory in the monorepo */
  resolvePath: (...pathSegments: string[]) => string;
  /** resolves an absolute path from a relative directory in a package */
  resolvePathInPackage: (...pathSegments: string[]) => string;
  /** runtime parameters */
  runtime: {
    /** name of the shell of the system */
    shell: string;
    /** espoir runtime */
    espoir: {
      /** name of espoir-cli */
      name: string;
      /** version string of espoir-cli */
      version: string;
      /** README.md link at github */
      github: string;
    };
    /** npm runtime */
    npm: {
      /** registry configuration */
      registry: string;
    };
    /** node runtime */
    node: {
      /** node version */
      version: string;
    };
  };
  /** espoir configuration */
  configs: EspoirConfigs;
}>;

const env = lazyReadonly<
  EspoirEnv, {
    thisPkg: {
      name: string;
      version: string;
      homepage: string;
    };
    configFile: string | undefined;
    configFileData: Partial<EspoirConfigs>;
  }
>({
  // unreachable context entries
  thisPkg: () => require('../../package.json'),
  configFile: ({ rootDir }) => {
    return rootDir ? [
      'espoir.config.js',
      'espoir.config.json'
    ].map(fn => path.join(rootDir, fn)).find(fs.existsSync) : undefined
  },
  configFileData: ({ configFile }) => configFile ? require(configFile) : {},
  // env
  version: ({ thisPkg }) => parseInt(thisPkg.version.split('.')[0] as string, 10),
  rootDir: () => locateRoot(),
  rootPkg: ({ rootDir }) => rootDir ? require(path.resolve(rootDir, 'package.json')) as PackageJSON : null,
  packages: ({ rootDir }) => rootDir ? fs.readdirSync(path.resolve(rootDir, 'packages')) : null,
  packageMap: ({ rootDir, packages }) => {
    return rootDir && packages ? Object.fromEntries(
      packages.map(p => [
        p, require(path.resolve(rootDir, 'packages', p, 'package.json')) as PackageJSON
      ])
    ) : null
  },
  currentPackage: ({ rootDir }) => locatePackage(rootDir) ?? null,
  resolvePath: ({ rootDir }) => (...pathSegments: string[]): string => {
    if (rootDir) {
      return path.resolve(rootDir, ...pathSegments);
    }

    throw new Error(
      `You're outside a espoir workspace.`
    );
  },
  resolvePathInPackage: ({ rootDir }) => (
    packageName: string, ...pathSegments: string[]
  ): string => {
    if (rootDir) {
      return path.resolve(rootDir, 'packages', packageName, ...pathSegments);
    }

    throw new Error(
      `You're outside a espoir workspace.`
    );
  },
  runtime: ({ thisPkg }) => lazyReadonly<EspoirEnv['runtime']>({
    shell: () => process.platform === 'win32' ? (process.env['ComSpec'] || 'cmd') : (process.env['SHELL'] || 'sh'),
    espoir: () => ({
      name: thisPkg.name,
      version: thisPkg.version,
      github: thisPkg.homepage
    }),
    npm: () => lazyReadonly<EspoirEnv['runtime']['npm']>({
      registry: () => {
        try {
          return execSync('npm config get registry', { encoding: 'utf-8' }).replace(/\n$/, '');
        } catch {
          return 'https://registry.npmjs.org/';
        }
      }
    }),
    node: () => ({
      version: process.version
    })
  }),
  configs: ({ configFileData }) => ({
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
  })
}) as EspoirEnv & {
  [lazyUpdate]: (keys: (keyof EspoirEnv)[]) => void;
};


export default env;
