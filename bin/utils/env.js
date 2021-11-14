"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:31:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 23:02:59
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var child_process_1 = require("child_process");
var configs = {
    cacheDir: path.resolve(__filename, '..', '..', '..'), // FIXME:
};
// ************************************ //
//                 ROOT                 //
// ************************************ //
/** Dir of the repo root. */
var rootDir = path.resolve(__filename, '..', '..', '..');
/** Package.json config of the repo root. */
var rootPkg = require(path.resolve(__filename, '..', '..', '..', 'package.json'));
// ************************************ //
//                PACKAGE               //
// ************************************ //
/** Names of all packages. */
var packages = fs.readdirSync(path.resolve(rootDir, 'packages'));
/** Package.json mappings for each package. */
var packageMap = Object.fromEntries(packages.map(function (p) { return [
    p, require(path.resolve(rootDir, 'packages', p, 'package.json'))
]; }));
// ************************************ //
//                METHODS               //
// ************************************ //
/**
 * Returns the absolute path relative to the dir of the root.
 *
 * @param {string[]} pathSegments
 * @returns {string}
 */
var resolvePath = function () {
    var pathSegments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pathSegments[_i] = arguments[_i];
    }
    return path.resolve.apply(path, __spreadArray([rootDir], pathSegments, false));
};
/**
 * Returns the absolute path relative to the dir of the given package.
 *
 * @param {string} packageName
 * @param {string[]} pathSegments
 * @returns {string}
 */
var resolvePathInPackage = function (packageName) {
    var pathSegments = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        pathSegments[_i - 1] = arguments[_i];
    }
    return path.resolve.apply(path, __spreadArray([rootDir, 'packages', packageName], pathSegments, false));
};
var env = {
    rootDir: rootDir,
    rootPkg: rootPkg,
    packages: packages,
    packageMap: packageMap,
    resolvePath: resolvePath,
    resolvePathInPackage: resolvePathInPackage,
    runtime: {
        shell: process.platform === 'win32' ? (process.env['ComSpec'] || 'cmd') : (process.env['SHELL'] || 'sh'),
        npm: {
            registry: (function () {
                try {
                    return (0, child_process_1.execSync)('npm config get registry', { encoding: 'utf-8' }).replace(/\n$/, '');
                }
                catch (_a) {
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
