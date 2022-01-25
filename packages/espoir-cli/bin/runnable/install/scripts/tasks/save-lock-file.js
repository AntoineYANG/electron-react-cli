"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:27:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:53:53
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lock_1 = require("@@install/utils/lock");
const logger_1 = require("@ui/logger");
const index_1 = require("@src/index");
const saveLockFile = () => ({
    title: 'Saving lock file.',
    task: (ctx, task) => {
        task.output = 'Saving espoir lock file';
        try {
            (0, lock_1.writeLockFile)(ctx.lockData);
            task.output = 'Espoir lock file saved';
        }
        catch (error) {
            logger_1.default.logError(error);
            process.exit(index_1.ExitCode.UNCAUGHT_EXCEPTION);
        }
    }
});
exports.default = saveLockFile;
