"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 21:19:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 23:13:30
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@src/index");
const _runnable_1 = require("@runnable");
const remove_modules_1 = require("./tasks/remove-modules");
const update_package_1 = require("./tasks/update-package");
/**
 * Uninstall dependencies.
 *
 * @param {string[]} moduleNames
 * @param {string[]} scopes
 * @param {boolean} updateLock
 * @returns {Promise<ExitCode>}
 */
const uninstallDeps = async (moduleNames, scopes, updateLock) => {
    const tasks = (0, _runnable_1.TaskManagerFactory)();
    tasks.add([
        (0, remove_modules_1.default)(moduleNames, scopes),
        (0, update_package_1.default)(moduleNames, scopes, updateLock)
    ], {
        exitOnError: true,
        concurrent: false
    });
    const _ctx = await tasks.runAll();
    return index_1.ExitCode.OK;
};
exports.default = uninstallDeps;
