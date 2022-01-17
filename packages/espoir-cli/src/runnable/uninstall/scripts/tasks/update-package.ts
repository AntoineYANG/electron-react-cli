/*
 * @Author: Kanata You 
 * @Date: 2022-01-12 23:00:21 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:55:23
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';

import delDep from '@@uninstall/scripts/utils/del-dep';
import { LockData, writeLockFile } from '@@install/utils/lock';


interface Context {
  lockData: LockData;
}

const updatePackage = <T extends Context>(
  modules: string[],
  packages: string[],
  updateLock: boolean
): ListrTask<T, ListrRendererFactory> => ({
  title: `Updating package.json${updateLock ? ' and lock file' : ''}.`,
  task: (ctx, task) => {
    task.output = 'Updating package.json';

    packages.forEach(pkg => {
      modules.forEach(mod => {
        delDep(pkg, mod);
      });
    });

    task.output = 'package.json updated';

    if (updateLock) {
      task.output = 'Updating lock file';
      writeLockFile(ctx.lockData);
      task.output = 'Lock file updates';
    }
  }
});


export default updatePackage;
