"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:31:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 16:44:26
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

const fs = require("fs");

const child_process_1 = require("child_process");

const _lazy_1 = require("./lazy-readonly"); // ************************************ //
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
    // cannot find root package
    return null;
  }

  return locateRoot(upper);
};

const locatePackage = (rootDir, dir = process.cwd()) => {
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

const env = (0, _lazy_1.default)({
  // unreachable context entries
  thisPkg: () => require("../../package.json"),
  configFile: ({
    rootDir
  }) => {
    return rootDir ? ['espoir.config.js', 'espoir.config.json'].map(fn => path.join(rootDir, fn)).find(fs.existsSync) : undefined;
  },
  configFileData: ({
    configFile
  }) => configFile ? require(configFile) : {},
  // env
  version: ({
    thisPkg
  }) => parseInt(thisPkg.version.split('.')[0], 10),
  rootDir: () => locateRoot(),
  rootPkg: ({
    rootDir
  }) => rootDir ? require(path.resolve(rootDir, 'package.json')) : null,
  packages: ({
    rootDir
  }) => rootDir ? fs.readdirSync(path.resolve(rootDir, 'packages')) : null,
  packageMap: ({
    rootDir,
    packages
  }) => {
    return rootDir && packages ? Object.fromEntries(packages.map(p => [p, require(path.resolve(rootDir, 'packages', p, 'package.json'))])) : null;
  },
  currentPackage: ({
    rootDir
  }) => locatePackage(rootDir) ?? null,
  resolvePath: ({
    rootDir
  }) => (...pathSegments) => {
    if (rootDir) {
      return path.resolve(rootDir, ...pathSegments);
    }

    throw new Error(`You're outside a espoir workspace.`);
  },
  resolvePathInPackage: ({
    rootDir
  }) => (packageName, ...pathSegments) => {
    if (rootDir) {
      return path.resolve(rootDir, 'packages', packageName, ...pathSegments);
    }

    throw new Error(`You're outside a espoir workspace.`);
  },
  runtime: ({
    thisPkg
  }) => (0, _lazy_1.default)({
    shell: () => process.platform === 'win32' ? process.env['ComSpec'] || 'cmd' : process.env['SHELL'] || 'sh',
    espoir: () => ({
      name: thisPkg.name,
      version: thisPkg.version,
      github: thisPkg.homepage
    }),
    npm: () => (0, _lazy_1.default)({
      registry: () => {
        try {
          return (0, child_process_1.execSync)('npm config get registry', {
            encoding: 'utf-8'
          }).replace(/\n$/, '');
        } catch {
          return 'https://registry.npmjs.org/';
        }
      }
    }),
    node: () => ({
      version: process.version
    })
  }),
  configs: ({
    configFileData
  }) => ({
    cacheDir: path.resolve(__filename, '..', '..', '..'),
    commit: {
      types: configFileData.commit?.types ?? ['feature', 'bugfix', 'refactor', 'performance', 'chore'],
      optional: configFileData.commit?.optional ?? false,
      format: configFileData.commit?.format ?? '<type>(<scope?>): <subject>',
      subject: {
        min: configFileData.commit?.subject?.min ?? 4,
        max: configFileData.commit?.subject?.max ?? 40,
        pattern: configFileData.commit?.subject?.pattern ? typeof configFileData.commit.subject.pattern === 'string' ? new RegExp(configFileData.commit.subject.pattern) : configFileData.commit.subject.pattern : /^.*$/
      }
    }
  })
});
exports.default = env;