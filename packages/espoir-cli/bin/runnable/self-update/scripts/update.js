"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-26 16:47:26
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:44:58
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

const _env_1 = require("../../../utils/env");

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");

const print_update_detail_1 = require("../utils/print-update-detail");
/**
 * Update espoir-cli.
 *
 * @returns {Promise<ExitCode>}
 */


const update = async () => {
  logger_1.default.info('  Updating espoir-cli. ');
  const res = (0, child_process_1.execSync)('npm i -g espoir-cli@latest', {
    encoding: 'utf-8'
  });
  logger_1.default.info(res);
  const version = (0, child_process_1.execSync)('npm i -g espoir-cli@latest', {
    encoding: 'utf-8'
  }).split('\n')[0];

  if (version !== _env_1.default.runtime.espoir.version) {
    await (0, print_update_detail_1.default)(version);
  }

  return index_1.ExitCode.OK;
};

exports.default = update;