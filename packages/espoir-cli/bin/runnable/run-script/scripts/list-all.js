"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-30 19:14:41
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-30 19:39:25
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chalk = require("chalk");

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");

const _env_1 = require("../../../utils/env");

const get_runnable_scripts_1 = require("../utils/get-runnable-scripts");

const shortHand = n => {
  if (_env_1.default.currentPackage && n.startsWith(_env_1.default.currentPackage)) {
    return chalk`  ({blue ${n.split('\.')[1]}})`;
  }

  return null;
};
/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {string[]}
 */


const listAll = async scope => {
  const res = (0, get_runnable_scripts_1.default)(scope);
  logger_1.default.info(chalk`Found {greenBright ${res.length} }scripts${scope ? chalk` in {blue ${scope} }` : ''}`);
  res.forEach(n => {
    logger_1.default.info(chalk`  * {blue ${n} }${shortHand(n) ?? ''}`);
  });
  return index_1.ExitCode.OK;
};

exports.default = listAll;