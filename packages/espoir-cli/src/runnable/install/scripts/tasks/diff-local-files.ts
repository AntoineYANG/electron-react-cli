/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:15:40 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:52:34
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';

import { createLockData, LockData } from '@@install/utils/lock';
import type { VersionInfo } from '@request/request-npm';
import diffLocal from '@@install/utils/diff-local';


interface Context {
  resolvedDeps: VersionInfo[];
  diff: VersionInfo[];
  lockData: LockData;
}

const diffLocalFiles = <T extends Context>(): ListrTask<T, ListrRendererFactory> => ({
  title: 'Diffing local files.',
  task: async (ctx, task) => {
    task.output = 'Checking installed modules';
    ctx.diff = await diffLocal(ctx.resolvedDeps);
    
    ctx.lockData = createLockData(ctx.lockData, ctx.diff);

    task.output = 'Diffing succeeded';
  }
});


export default diffLocalFiles;
