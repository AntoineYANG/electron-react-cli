/*
 * @Author: Kanata You 
 * @Date: 2022-01-26 16:47:26 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:50:45
 */

import { execSync } from 'child_process';

import { ExitCode } from '@src/index';
import Logger from '@ui/logger';


/**
 * Update espoir-cli.
 * 
 * @returns {Promise<ExitCode>}
 */
const update = async (): Promise<ExitCode> => {
  Logger.info('  Updating espoir-cli. ');

  const res = execSync(
    'npm i -g espoir-cli@latest', {
      encoding: 'utf-8'
    }
  );

  Logger.info(res);


  return ExitCode.OK;
};

export default update;
