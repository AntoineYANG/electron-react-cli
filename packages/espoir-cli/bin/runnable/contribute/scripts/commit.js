"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-02 18:21:07
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-11 19:34:13
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const index_1 = require("@src/index");
const logger_1 = require("@ui/logger");
const git_preset_1 = require("./tasks/git-preset");
const changlog_1 = require("./tasks/changlog");
const push_remote_1 = require("./tasks/push-remote");
/**
 * Modify the changes and commit them.
 *
 * @returns {Promise<ExitCode>}
 */
const commit = async () => {
    logger_1.default.info('  Checking git state. ');
    const gitState = await (0, git_preset_1.default)();
    if (gitState.changes.staged.length === 0) {
        logger_1.default.error('Nothing to commit. ');
        return index_1.ExitCode.OPERATION_FAILED;
    }
    const log = await (0, changlog_1.default)(gitState);
    const res = (0, child_process_1.execSync)(`git commit -m "${log.replace('"', '\"')}"`, {
        encoding: 'utf-8'
    });
    logger_1.default.info(res);
    const resPush = await (0, push_remote_1.default)(gitState);
    logger_1.default.info(resPush);
    return index_1.ExitCode.OK;
};
exports.default = commit;
