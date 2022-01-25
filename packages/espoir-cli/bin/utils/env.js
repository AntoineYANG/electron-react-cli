"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:31:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:33:55
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
// ************************************ //
//                 THIS                 //
// ************************************ //
const thisPkg = require('../../package.json');
// ************************************ //
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
/** Dir of the repo root. */
const rootDir = locateRoot();
/** Package.json config of the repo root. */
const rootPkg = rootDir ? require(path.resolve(rootDir, 'package.json')) : null;
// ************************************ //
//                PACKAGE               //
// ************************************ //
/** Names of all packages. */
const packages = rootDir ? fs.readdirSync(path.resolve(rootDir, 'packages')) : null;
/** Package.json mappings for each package. */
const packageMap = rootDir && packages ? Object.fromEntries(packages.map(p => [
    p, require(path.resolve(rootDir, 'packages', p, 'package.json'))
])) : null;
const locatePackage = (dir = process.cwd()) => {
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
const resolvePath = (...pathSegments) => {
    if (rootDir) {
        return path.resolve(rootDir, ...pathSegments);
    }
    throw new Error(`You're outside a espoir workspace.`);
};
/**
 * Returns the absolute path relative to the dir of the given package.
 *
 * @param {string} packageName
 * @param {string[]} pathSegments
 * @returns {string}
 */
const resolvePathInPackage = (packageName, ...pathSegments) => {
    if (rootDir) {
        return path.resolve(rootDir, 'packages', packageName, ...pathSegments);
    }
    throw new Error(`You're outside a espoir workspace.`);
};
const configFile = rootDir ? [
    'espoir.config.js',
    'espoir.config.json'
].map(fn => path.join(rootDir, fn)).find(fs.existsSync) : undefined;
const configFileData = configFile ? require(configFile) : {};
const configs = {
    cacheDir: path.resolve(__filename, '..', '..', '..'),
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
            pattern: configFileData.commit?.subject?.pattern ? (typeof configFileData.commit.subject.pattern === 'string' ? (new RegExp(configFileData.commit.subject.pattern)) : (configFileData.commit.subject.pattern)) : /^.*$/
        }
    }
};
const env = {
    version: parseInt(thisPkg.version.split('.')[0]),
    rootDir,
    rootPkg,
    packages,
    packageMap,
    currentPackage,
    resolvePath,
    resolvePathInPackage,
    runtime: {
        shell: process.platform === 'win32' ? (process.env['ComSpec'] || 'cmd') : (process.env['SHELL'] || 'sh'),
        espoir: {
            name: thisPkg.name,
            version: thisPkg.version
        },
        npm: {
            registry: (() => {
                try {
                    return (0, child_process_1.execSync)('npm config get registry', { encoding: 'utf-8' }).replace(/\n$/, '');
                }
                catch {
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
