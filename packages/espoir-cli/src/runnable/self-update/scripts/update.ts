/*
 * @Author: Kanata You 
 * @Date: 2022-01-26 16:47:26 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:44:58
 */

import { execSync } from 'child_process';

import env from '@env';
import { ExitCode } from '@src/index';
import Logger from '@ui/logger';
import printUpdateDetail from '@@su/utils/print-update-detail';


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

  const version = execSync(
    'npm i -g espoir-cli@latest', {
      encoding: 'utf-8'
    }
  ).split('\n')[0] as string;

  if (version !== env.runtime.espoir.version) {
    await printUpdateDetail(version);
  }


  return ExitCode.OK;
};

export default update;
