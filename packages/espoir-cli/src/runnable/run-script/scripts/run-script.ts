/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 19:14:41 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:59:16
 */

import * as chalk from 'chalk';
import { spawn } from 'child_process';

import { ExitCode } from '@src/index';
import Logger from '@ui/logger';
import env from '@env';


/**
 * Run a script.
 *
 * @param {string} scope
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<ExitCode>}
 */
const runScript = async (
  scope: string,
  command: string,
  cmd: string,
  cwd: string,
  args: string[]
): Promise<ExitCode> => {
  Logger.info(
    `\n${
      chalk`|> Run {blue ${command} }in {blue ${scope} }`
    }\n${
      `|> ${cmd}`
    }\n`
  );

  let resolve = (val: ExitCode): void => {};

  const p = new Promise<ExitCode>(res => {
    resolve = res;
  });

  const paths = `${process.env['PATH'] ?? ''}${
    env.resolvePath('.espoir', '.bin')
  };`;

  const cp = spawn(
    `${cmd}${
      args.map(s => ` ${s}`).join('')
    } --color`,
    {
      stdio: 'pipe',
      cwd,
      shell: true,
      env: {
        ...process.env,
        PATH: paths
      }
    }
  );

  cp.stdout.on('data', data => {
    Logger.info(data.toString('utf-8'));
  });

  cp.stderr.on('data', data => {
    Logger.info(data.toString('utf-8'));
  });

  cp.on('close', code => {
    Logger.info(
      chalk`\n{blue ${scope}.${command} }returns code ${code}. \n`
    );
    resolve(code === 0 ? ExitCode.OK : ExitCode.OPERATION_FAILED);
  });
  

  return p;
};

export default runScript;
