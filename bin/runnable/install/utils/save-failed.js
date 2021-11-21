"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:39:25
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:47:30
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mkdirp_1 = require("mkdirp");
const env_1 = require("../../../utils/env");
const dir = env_1.default.resolvePath('.espoir');
const fn = env_1.default.resolvePath('.espoir', 'failed-to-install.json');
if (!fs.existsSync(dir)) {
    (0, mkdirp_1.sync)(dir);
}
/**
 * Save messages of the modules failed to install.
 *
 * @param {InstallResult[]} installResults results of the installation, allowed to include succeeded ones
 * @returns {(string | null)} if the param includes failure messages, returns the path of the file, otherwise returns null
 */
const saveFailed = (installResults) => {
    const failedBefore = [];
    if (fs.existsSync(fn)) {
        failedBefore.push(...JSON.parse(fs.readFileSync(fn, {
            encoding: 'utf-8'
        })));
    }
    const failed = installResults.filter(ir => !ir.data);
    if (failed.length === 0) {
        return null;
    }
    fs.writeFileSync(fn, JSON.stringify([...failedBefore, failed]));
    return fn;
};
exports.default = saveFailed;
