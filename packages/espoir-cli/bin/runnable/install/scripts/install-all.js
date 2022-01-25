"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-20 00:00:33
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-02 18:02:39
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@src/index");
const _runnable_1 = require("@runnable");
const use_package_deps_1 = require("./tasks/use-package-deps");
const diff_local_files_1 = require("./tasks/diff-local-files");
const install_resolved_deps_1 = require("./tasks/install-resolved-deps");
const create_links_1 = require("./tasks/create-links");
const save_lock_file_1 = require("./tasks/save-lock-file");
const save_fail_msg_1 = require("./tasks/save-fail-msg");
const link_executable_1 = require("./tasks/link-executable");
/**
 * Install local dependencies.
 *
 * @param {boolean} isProd
 * @param {string[]} scopes
 * @returns {Promise<ExitCode>}
 */
const installAll = async (isProd, scopes) => {
    const tasks = (0, _runnable_1.TaskManagerFactory)();
    tasks.add([
        (0, use_package_deps_1.default)(scopes, isProd),
        (0, diff_local_files_1.default)(),
        (0, install_resolved_deps_1.default)(),
        (0, create_links_1.default)(),
        (0, link_executable_1.default)(),
        (0, save_lock_file_1.default)(),
        (0, save_fail_msg_1.default)()
    ], {
        exitOnError: true,
        concurrent: false
    });
    const _ctx = await tasks.runAll();
    return index_1.ExitCode.OK;
};
exports.default = installAll;
