/*
 * @Author: Kanata You 
 * @Date: 2022-01-12 21:19:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 23:13:30
 */

import { ExitCode } from '@src/index';
import { TaskManagerFactory } from '@runnable';
import type { LockData } from '@@install/utils/lock';

import type { Requirement } from './utils/analyse-requirements';
import removeModules from './tasks/remove-modules';
import updatePackage from './tasks/update-package';


interface Context {
  lockData: LockData;
  requirements: Requirement[];
  removed: string[];
}

/**
 * Uninstall dependencies.
 * 
 * @param {string[]} moduleNames
 * @param {string[]} scopes
 * @param {boolean} updateLock
 * @returns {Promise<ExitCode>}
 */
const uninstallDeps = async (
  moduleNames: string[],
  scopes: string[],
  updateLock: boolean
): Promise<ExitCode> => {
  const tasks = TaskManagerFactory<Context>();

  tasks.add([
    removeModules<Context>(moduleNames, scopes),
    updatePackage<Context>(moduleNames, scopes, updateLock)
  ], {
    exitOnError: true,
    concurrent: false
  });

  const _ctx = await tasks.runAll();

  return ExitCode.OK;
};

export default uninstallDeps;
