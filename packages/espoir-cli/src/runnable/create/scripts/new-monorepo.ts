/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 19:08:44 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:35:22
 */

import { ExitCode } from '@src/index';

import Logger from '@ui/logger';
import createMonorepo from './tasks/create-monorepo';
import monorepoSetup, { MonorepoConfig } from './tasks/monorepo-setup';


interface Context {
  config: MonorepoConfig;
}

/**
 * Create new espoir monorepo.
 * 
 * @returns {Promise<ExitCode>}
 */
const newMonorepo = async (): Promise<ExitCode> => {
  Logger.info('  Creating new espoir monorepo. ');
  
  const config: Context['config'] = await monorepoSetup();

  createMonorepo(config);

  Logger.info(`  Completed. \`cd ${config.name}\` to begin. `);


  return ExitCode.OK;
};

export default newMonorepo;
