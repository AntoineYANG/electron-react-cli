/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 19:14:41 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:23:16
 */

import * as chalk from 'chalk';

import { ExitCode } from '@src/index';
import Logger from '@ui/logger';
import env from '@env';
import getRunnableScripts from '@@run/utils/get-runnable-scripts';


const shortHand = (n: string): string | null => {
  if (env.currentPackage && n.startsWith(env.currentPackage)) {
    return chalk`  ({cyan ${
      n.split('\.')[1]
    }})`;
  } else if (process.cwd().startsWith(env.rootDir as string) && n.startsWith('root.')) {
    return chalk`  ({cyan ${
      n.split('\.')[1]
    }})`;
  }

  return null;
};

const DETAIL_MAX_LEN = 36;

/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {string[]}
 */
const listAll = async (
  scope?: string
): Promise<ExitCode> => {
  const res = getRunnableScripts(scope);

  Logger.info(
    chalk`Found {greenBright ${res.length} }scripts${
      scope ? chalk` in {blue ${scope} }` : ''
    }`
  );
  
  res.forEach(n => {
    Logger.info(
      chalk`  * {blueBright ${n.name} }${
        shortHand(n.name) ?? ''
      }`
    );
    Logger.info(
      chalk`    {gray ${n.cmd.slice(0, DETAIL_MAX_LEN + 1)}${
        n.cmd.length > DETAIL_MAX_LEN ? '...' : ''
      } }`
    );
  });

  return ExitCode.OK;
};

export default listAll;
