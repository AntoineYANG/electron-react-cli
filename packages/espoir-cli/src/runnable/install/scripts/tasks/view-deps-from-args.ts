/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:07:04 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:31:18
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import * as chalk from 'chalk';

import parseDependencies from '@@install/utils/parse-dependencies'
import { LockData, useLockFileData } from '@@install/utils/lock';
import { resolvePackageDeps } from '@@install/utils/resolve-deps';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { VersionInfo } from '@request/request-npm';


interface Context {
  dependencies: SingleDependency[];
  resolvedDeps: VersionInfo[];
  diff: VersionInfo[];
  lockData: LockData;
}

/**
 * This action will parse an array of strings as dependencies and resolve their dependencies.
 * `Context.dependencies`, `Context.lockData` and `Context.resolvedDeps` will be assigned.
 *
 * @template T context type
 * @param {string[]} modules
 * @returns {ListrTask<T, typeof DefaultRenderer>}
 */
const viewDepsFromArgs = <T extends Context>(modules: string[]): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Viewing dependencies.',
  task: async (ctx, task) => {
    // parse
    task.output = 'Parsing dependencies';
    ctx.dependencies = parseDependencies(modules);
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


export default viewDepsFromArgs;
