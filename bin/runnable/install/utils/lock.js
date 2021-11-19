"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 20:49:31
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 01:37:28
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLockFileData = exports.writeLockFile = exports.createLockData = void 0;
const fs = require("fs");
const env_1 = require("../../../utils/env");
/**
 * Generates espoir lock data from version info.
 *
 * @param {LockData} origin
 * @param {VersionInfo[]} data
 * @returns {LockData}
 */
const createLockData = (origin, data) => {
    const result = origin;
    data.forEach(d => {
        if (!result[d.name]) {
            result[d.name] = {};
        }
        const thisModule = result[d.name];
        thisModule[d.version] = {
            resolved: d.dist.tarball,
            integrity: d.dist.integrity,
            path: '',
            target: '',
            requires: {}
        };
        const requires = thisModule[d.version]?.requires;
        Object.entries(d.dependencies ?? {}).forEach(([name, range]) => {
            requires[name] = range;
        });
    });
    return result;
};
exports.createLockData = createLockData;
const dir = env_1.default.resolvePath('.espoir');
const fn = env_1.default.resolvePath('.espoir', 'espoir-lock.json');
/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {LockData} data
 */
const writeLockFile = (data) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(fn, JSON.stringify(data, undefined, 2), {
        encoding: 'utf-8'
    });
};
exports.writeLockFile = writeLockFile;
const useLockFileData = () => {
    if (fs.existsSync(fn)) {
        return JSON.parse(fs.readFileSync(fn, {
            encoding: 'utf-8'
        }));
    }
    return {};
};
exports.useLockFileData = useLockFileData;
