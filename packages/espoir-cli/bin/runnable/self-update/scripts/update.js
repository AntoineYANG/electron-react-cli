"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-26 16:47:26
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:50:45
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");
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
  return index_1.ExitCode.OK;
};

exports.default = update;