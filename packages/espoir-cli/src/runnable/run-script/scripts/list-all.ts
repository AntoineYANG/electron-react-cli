/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 19:14:41 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:59:09
 */

import * as chalk from 'chalk';

import { ExitCode } from '@src/index';
import Logger from '@ui/logger';
import env from '@env';
import getRunnableScripts from '@@run/utils/get-runnable-scripts';


const shortHand = (n: string): string | null => {
  if (env.currentPackage && n.startsWith(env.currentPackage)) {
    return chalk`  ({blue ${
      n.split('\.')[1]
    }})`;
  }

  return null;
};

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
      chalk`  * {blue ${n} }${
        shortHand(n.name) ?? ''
      }`
    );
  });

  return ExitCode.OK;
};

export default listAll;
