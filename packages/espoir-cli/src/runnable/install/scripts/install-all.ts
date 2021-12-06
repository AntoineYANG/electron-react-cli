/*
 * @Author: Kanata You 
 * @Date: 2021-11-20 00:00:33 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-02 18:02:39
 */

import { ExitCode } from '@src/index';
import { TaskManagerFactory } from '@runnable';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { VersionInfo } from '@request/request-npm';
import type { LockData } from '@@install/utils/lock';
import type { InstallResult } from '@@install/utils/download-deps';
import type { CliLink } from '@@install/utils/link-cli';

import usePackageDeps from './tasks/use-package-deps';
import diffLocalFiles from './tasks/diff-local-files';
import installResolvedDeps from './tasks/install-resolved-deps';
import createLinks from './tasks/create-links';
import saveLockFile from './tasks/save-lock-file';
import saveFailMsg from './tasks/save-fail-msg';
import linkExecutable from './tasks/link-executable';


interface Context {
  dependencies: SingleDependency[];
  resolvedDeps: VersionInfo[];
  diff: VersionInfo[];
  lockData: LockData;
  installResults: InstallResult[];
  bin: CliLink[];
}

/**
 * Install local dependencies.
 * 
 * @param {boolean} isProd
 * @param {string[]} scopes
 * @returns {Promise<ExitCode>}
 */
const installAll = async (
  isProd: boolean,
  scopes: string[]
): Promise<ExitCode> => {
  const tasks = TaskManagerFactory<Context>();

  tasks.add([
    usePackageDeps<Context>(scopes, isProd),
    diffLocalFiles<Context>(),
    installResolvedDeps<Context>(),
    createLinks<Context>(),
    linkExecutable<Context>(),
    saveLockFile<Context>(),
    saveFailMsg<Context>()
  ], {
    exitOnError: true,
    concurrent: false
  });

  const _ctx = await tasks.runAll();

  return ExitCode.OK;
};

export default installAll;
