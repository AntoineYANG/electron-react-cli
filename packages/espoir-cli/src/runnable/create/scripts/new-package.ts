/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 20:16:27 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:50:07
 */

import { ExitCode } from '@src/index';

import Logger from '@ui/logger';
import createPackage from './tasks/create-package';
import packageSetup, { RepoPackageConfig } from './tasks/package-setup';


interface Context {
  config: RepoPackageConfig;
}

/**
 * Create new package in this monorepo.
 * 
 * @returns {Promise<ExitCode>}
 */
const newPackage = async (): Promise<ExitCode> => {
  Logger.info('  Creating new package. ');
  
  const config: Context['config'] = await packageSetup();

  await createPackage(config);

  Logger.info(`  Completed. `);


  return ExitCode.OK;
};

export default newPackage;
