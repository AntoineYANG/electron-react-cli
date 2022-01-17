/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:27:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:53:53
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';

import { LockData, writeLockFile } from '@@install/utils/lock';
import Logger from '@ui/logger';
import { ExitCode } from '@src/index';


interface Context {
  lockData: LockData;
}

const saveLockFile = <T extends Context>(): ListrTask<T, ListrRendererFactory> => ({
  title: 'Saving lock file.',
  task: (ctx, task) => {
    task.output = 'Saving espoir lock file';

    try {
      writeLockFile(ctx.lockData);
      task.output = 'Espoir lock file saved';
    } catch (error) {
      Logger.logError(error);
      process.exit(ExitCode.UNCAUGHT_EXCEPTION);
    }
  }
});


export default saveLockFile;
