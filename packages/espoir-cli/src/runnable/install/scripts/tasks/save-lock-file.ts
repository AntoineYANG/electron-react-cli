/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:27:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 23:41:43
 */

import { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import { LockData, writeLockFile } from '@@install/utils/lock';
import Logger from '@ui/logger';
import { ExitCode } from '@src/index';


interface Context {
  lockData: LockData;
}

const saveLockFile = <T extends Context>(): ListrTask<T, typeof DefaultRenderer> => ({
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
