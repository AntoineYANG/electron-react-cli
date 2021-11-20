"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 20:49:31
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-21 01:33:18
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLockFileData = exports.writeLockFile = exports.createLockData = exports.LockCheckFailedReason = void 0;
const fs = require("fs");
const env_1 = require("../../../utils/env");
var LockCheckFailedReason;
(function (LockCheckFailedReason) {
    LockCheckFailedReason[LockCheckFailedReason["FILES_NOT_FOUND"] = 1] = "FILES_NOT_FOUND";
})(LockCheckFailedReason = exports.LockCheckFailedReason || (exports.LockCheckFailedReason = {}));
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
        if (thisModule[d.version]) {
            if (!d.lockInfo?.failed) {
                console.log(d.name, thisModule[d.version]);
                process.exit(-1);
                throw new Error(`"${d.name}@${d.version}" is already recorded in lock file. `);
            }
            // else: overwrite
        }
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
    const sorted = {};
    Object.entries(data).sort((a, b) => {
        const an = a[0];
        const bn = b[0];
        for (let i = 0; i < an.length && i < bn.length; i += 1) {
            const ac = an.charCodeAt(i);
            const bc = bn.charCodeAt(i);
            if (ac !== bc) {
                return ac - bc;
            }
        }
        return an.length - bn.length;
    }).forEach(([k, v]) => {
        sorted[k] = v;
    });
    fs.writeFileSync(fn, JSON.stringify(sorted, undefined, 2), {
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
