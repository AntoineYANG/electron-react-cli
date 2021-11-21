/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:07:04 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:22:16
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import * as chalk from 'chalk';

import type { VersionInfo } from '../../../../utils/request/request-npm';
import type { InstallResult } from '../../utils/download-deps';
import batchDownload from '../../utils/download-deps';


const installResolvedDeps = <T extends {
  diff: VersionInfo[];
  installResults: InstallResult[];
}>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Installing resolved modules.',
  task: (ctx, task) => {
    task.output = chalk`🧱 {yellow.bold ${ctx.diff.length} }modules will be installed `;

    const printProgress = (
      completed: string[], failed: string[], total: string[]
    ) => {
      const pending = total.length - completed.length - failed.length;
      let output = chalk`🧱 {yellow.bold ${ctx.diff.length} }modules will be installed `;

      if (pending) {
        output += chalk` {yellow ${pending} pending }`;
      }
      
      if (completed.length) {
        output += chalk` {green ${completed.length} succeeded }`;
      }

      if (failed.length) {
        output += chalk` {red ${failed.length} failed }`;
      }

      task.output = output;
    };

    ctx.installResults = [];
    
    const subtasks = batchDownload(
      ctx.diff, printProgress, res => ctx.installResults.push(res)
    );
    
    return task.newListr(
      subtasks, {
        concurrent: true,
        rendererOptions: {
          clearOutput: true,
          collapse: true
        }
      }
    );
  }
});


export default installResolvedDeps;
