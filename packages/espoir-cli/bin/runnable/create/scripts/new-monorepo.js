"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 19:08:44
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:35:22
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");

const create_monorepo_1 = require("./tasks/create-monorepo");

const monorepo_setup_1 = require("./tasks/monorepo-setup");
/**
 * Create new espoir monorepo.
 *
 * @returns {Promise<ExitCode>}
 */


const newMonorepo = async () => {
  logger_1.default.info('  Creating new espoir monorepo. ');
  const config = await (0, monorepo_setup_1.default)();
  (0, create_monorepo_1.default)(config);
  logger_1.default.info(`  Completed. \`cd ${config.name}\` to begin. `);
  return index_1.ExitCode.OK;
};

exports.default = newMonorepo;