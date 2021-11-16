"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 20:49:31
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 20:57:02
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLockFile = exports.createLockData = void 0;
var fs = require("fs");
var env_1 = require("../../../utils/env");
/**
 * Generates espoir lock data from version info.
 *
 * @param {VersionInfo[]} data
 */
var createLockData = function (data) {
    var result = {};
    data.forEach(function (d) {
        var _a, _b;
        if (!result[d.name]) {
            result[d.name] = {};
        }
        var thisModule = result[d.name];
        thisModule[d.version] = {
            resolved: d.dist.tarball,
            integrity: d.dist.integrity,
            path: '',
            target: '',
            requires: {}
        };
        var requires = (_a = thisModule[d.version]) === null || _a === void 0 ? void 0 : _a.requires;
        Object.entries((_b = d.dependencies) !== null && _b !== void 0 ? _b : {}).forEach(function (_a) {
            var name = _a[0], range = _a[1];
            requires[name] = range;
        });
    });
    return result;
};
exports.createLockData = createLockData;
var dir = env_1.default.resolvePath('.espoir');
var fn = env_1.default.resolvePath('.espoir', 'espoir-lock.json');
/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {LockData} data
 */
var writeLockFile = function (data) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(fn, JSON.stringify(data, undefined, 2), {
        encoding: 'utf-8'
    });
};
exports.writeLockFile = writeLockFile;
