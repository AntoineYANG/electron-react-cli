/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:37:32 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 01:11:18
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import type { InstallResult } from '../../utils/download-deps';
import saveFailed from '../../utils/save-failed';


const saveFailMsg = <T extends {
  installResults: InstallResult[];
}>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Saving messages of failed tasks.',
  skip: ctx => Boolean(ctx.installResults.find(ir => !ir.data)),
  task: (ctx, task) => {
    task.output = 'Saving messages';

    saveFailed(ctx.installResults);

    task.output = 'Saving completed';
  }
});


export default saveFailMsg;
