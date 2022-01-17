/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 17:50:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:58:43
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';
import * as chalk from 'chalk';

import loadDependencies, { SingleDependency } from '@@install/utils/load-dependencies';
import { LockData, useLockFileData } from '@@install/utils/lock';
import { VersionInfo } from '@request/request-npm';
import { resolvePackageDeps } from '@@install/utils/resolve-deps';

interface Context {
  dependencies: SingleDependency[];
  lockData: LockData;
  resolvedDeps: VersionInfo[];
}

/**
 * Initialize `ctx.dependencies` by resolving dependencies in required packages.
 *
 * @template T
 * @param {string[]} scopes
 * @param {boolean} isProd
 * @returns {ListrTask<T, ListrRendererFactory>}
 */
const usePackageDeps = <T extends Context>(
  scopes: string[],
  isProd: boolean
): ListrTask<T, ListrRendererFactory> => ({
  title: 'Loading all the explicit dependencies from all `package.json`.',
  task: async (ctx, task) => {
    // parse
    task.output = 'Resolving `package.json`';
    ctx.dependencies = loadDependencies(scopes, isProd);
    task.output = 'Successfully resolved `package.json`';

    ctx.lockData = useLockFileData();

    // resolve
    task.output = 'Resolving dependencies';
    const printProgress = (resolved: number, unresolved: number) => {
      task.output = chalk` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
    };
    ctx.resolvedDeps = await resolvePackageDeps(
      ctx.dependencies,
      ctx.lockData,
      printProgress
    );

    task.output = 'Successfully resolved declared dependencies';
  }
});

export default usePackageDeps;
