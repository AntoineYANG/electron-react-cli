/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:37:32 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:53:38
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';

import type { InstallResult } from '@@install/utils/download-deps';
import saveFailed from '@@install/utils/save-failed';


interface Context {
  installResults: InstallResult[];
}

const saveFailMsg = <T extends Context>(): ListrTask<T, ListrRendererFactory> => ({
  title: 'Saving messages of failed tasks.',
  skip: ctx => Boolean(ctx.installResults.find(ir => !ir.data)),
  task: (ctx, task) => {
    task.output = 'Saving messages';

    saveFailed(ctx.installResults);

    task.output = 'Saving completed';
  }
});


export default saveFailMsg;
