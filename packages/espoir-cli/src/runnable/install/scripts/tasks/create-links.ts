/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:23:22 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:28:37
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import type { InstallResult } from '@@install/utils/download-deps';
import map from '@@install/utils/map';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';


interface Context {
  dependencies: SingleDependency[];
  lockData: LockData;
  installResults: InstallResult[];
}

const createLinks = <T extends Context>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Linking.',
  task: async (ctx, task) => {
    task.output = 'Linking /node_modules/';
    await map(
      ctx.dependencies,
      ctx.lockData,
      ctx.installResults,
      log => {
        task.output = log;
      }
    );
    task.output = 'Linked successfully';
  }
});


export default createLinks;
