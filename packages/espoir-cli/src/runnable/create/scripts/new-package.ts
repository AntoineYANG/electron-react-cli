/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 20:16:27 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:58:01
 */

import { ExitCode } from '@src/index';

import Logger from '@ui/logger';
import createPackage from './tasks/create-package';
import packageSetup, { RepoPackageConfig } from './tasks/package-setup';
import installForPackage from './tasks/install-for-package';


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

  const {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {}
  } = await createPackage(config);

  const deps = Object.keys({
    ...dependencies,
    ...devDependencies,
    ...peerDependencies
  }).length;

  if (deps) {
    await installForPackage(config.name);
  }

  Logger.info(`  Completed. `);


  return ExitCode.OK;
};

export default newPackage;
