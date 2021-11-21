/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:27:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:28:16
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import { LockData, writeLockFile } from '../../utils/lock';


const saveLockFile = <T extends {
  lockData: LockData;
}>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Saving lock file.',
  task: (ctx, task) => {
    task.output = 'Saving espoir lock file';
    writeLockFile(ctx.lockData);
    task.output = 'Espoir lock file saved';
  }
});


export default saveLockFile;
