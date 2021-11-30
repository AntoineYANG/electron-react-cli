/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:27:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-30 20:43:27
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import { SingleDependency } from '@@install/utils/load-dependencies';
import linkCLI, { CliLink, writeLinks } from '@@install/utils/link-cli';


const linkExecutable = <T extends {
  dependencies: SingleDependency[];
  bin: CliLink[];
}>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Creating links for CLI dependencies.',
  task: (ctx, task) => {
    task.output = 'Creating links';

    ctx.bin = linkCLI(ctx.dependencies);

    writeLinks(ctx.bin);
    
    task.output = `Created ${ctx.bin.length} links`;
  }
});


export default linkExecutable;
