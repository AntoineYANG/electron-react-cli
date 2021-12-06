"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-02 18:21:07
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 19:17:04
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");

const git_preset_1 = require("./tasks/git-preset");

const changlog_1 = require("./tasks/changlog");
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
  console.log(log);
  process.exit(-1);
  return index_1.ExitCode.OK;
};

exports.default = commit;