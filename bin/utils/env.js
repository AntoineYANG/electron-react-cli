"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:31:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 23:02:59
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
const configs = {
    cacheDir: path.resolve(__filename, '..', '..', '..'), // FIXME:
};
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
const packageMap = Object.fromEntries(packages.map(p => [
    p, require(path.resolve(rootDir, 'packages', p, 'package.json'))
]));
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
const env = {
    rootDir,
    rootPkg,
    packages,
    packageMap,
    resolvePath,
    resolvePathInPackage,
    runtime: {
        shell: process.platform === 'win32' ? (process.env['ComSpec'] || 'cmd') : (process.env['SHELL'] || 'sh'),
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
