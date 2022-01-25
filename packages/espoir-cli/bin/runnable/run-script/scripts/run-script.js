"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-30 19:14:41
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:59:16
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chalk = require("chalk");

const child_process_1 = require("child_process");

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");

const _env_1 = require("../../../utils/env");
/**
 * Run a script.
 *
 * @param {string} scope
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<ExitCode>}
 */


const runScript = async (scope, command, cmd, cwd, args) => {
  logger_1.default.info(`\n${chalk`|> Run {blue ${command} }in {blue ${scope} }`}\n${`|> ${cmd}`}\n`);

  let resolve = val => {};

  const p = new Promise(res => {
    resolve = res;
  });
  const paths = `${process.env['PATH'] ?? ''}${_env_1.default.resolvePath('.espoir', '.bin')};`;
  const cp = (0, child_process_1.spawn)(`${cmd}${args.map(s => ` ${s}`).join('')} --color`, {
    stdio: 'pipe',
    cwd,
    shell: true,
    env: { ...process.env,
      PATH: paths
    }
  });
  cp.stdout.on('data', data => {
    logger_1.default.info(data.toString('utf-8'));
  });
  cp.stderr.on('data', data => {
    logger_1.default.info(data.toString('utf-8'));
  });
  cp.on('close', code => {
    logger_1.default.info(chalk`\n{blue ${scope}.${command} }returns code ${code}. \n`);
    resolve(code === 0 ? index_1.ExitCode.OK : index_1.ExitCode.OPERATION_FAILED);
  });
  return p;
};

exports.default = runScript;