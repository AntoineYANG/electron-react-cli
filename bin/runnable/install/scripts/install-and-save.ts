/*
 * @Author: Kanata You 
 * @Date: 2021-11-20 22:17:42 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 01:14:00
 */

import { ExitCode } from '../../..';
import { TaskManagerFactory } from '../..';
import type { SingleDependency } from '../utils/load-dependencies';
import type { VersionInfo } from '../../../utils/request/request-npm';
import type { LockData } from '../utils/lock';
import type { InstallResult } from '../utils/download-deps';

import viewDepsFromArgs from './tasks/view-deps-from-args';
import diffLocalFiles from './tasks/diff-local-files';
import installResolvedDeps from './tasks/install-resolved-deps';
import createLinks from './tasks/create-links';
import saveLockFile from './tasks/save-lock-file';
import saveFailMsg from './tasks/save-fail-msg';
import savePackageJSON from './tasks/save-package-json';


interface Context {
  dependencies: SingleDependency[];
  resolvedDeps: VersionInfo[];
  diff: VersionInfo[];
  lockData: LockData;
  installResults: InstallResult[];
};

/**
 * Install modules and save as package dependencies.
 * 
 * @param {string[]} modules
 * @param {string[]} scopes
 * @param {('dependencies' | 'devDependencies')} tag
 * @returns {Promise<ExitCode>}
 */
const installAndSave = async (
  modules: string[],
  scopes: string[],
  tag: 'dependencies' | 'devDependencies'
): Promise<ExitCode> => {
  const tasks = TaskManagerFactory<Context>();

  tasks.add([
    viewDepsFromArgs<Context>(modules),
    diffLocalFiles<Context>(),
    installResolvedDeps<Context>(),
    createLinks<Context>(),
    saveLockFile<Context>(),
    saveFailMsg<Context>(),
    savePackageJSON<Context>(scopes, tag)
  ], {
    rendererOptions: {
      showSkipMessage: false
    },
    exitOnError: true,
    concurrent: false
  });

  const _ctx = await tasks.runAll();

  return ExitCode.OK;
};

export default installAndSave;
