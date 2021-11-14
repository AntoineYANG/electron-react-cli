"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 20:49:31
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:01:44
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLockFile = void 0;
var fs = require("fs");
var env_1 = require("../../../utils/env");
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
            requires: {}
        };
        var requires = (_a = thisModule[d.version]) === null || _a === void 0 ? void 0 : _a.requires;
        Object.entries((_b = d.dependencies) !== null && _b !== void 0 ? _b : {}).forEach(function (_a) {
            var name = _a[0], range = _a[1];
            requires[name] = {
                range: range,
                target: '' // FIXME:
            };
        });
    });
    return result;
};
var dir = env_1.default.resolvePath('.espoir');
var fn = env_1.default.resolvePath('.espoir', 'espoir-lock.json');
/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {VersionInfo[]} data
 */
var writeLockFile = function (data) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(fn, JSON.stringify(createLockData(data), undefined, 2), {
        encoding: 'utf-8'
    });
};
exports.writeLockFile = writeLockFile;
