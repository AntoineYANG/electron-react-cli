/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:27:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:29:43
 */

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';

import { SingleDependency } from '@@install/utils/load-dependencies';
import linkCLI, { CliLink, writeLinks } from '@@install/utils/link-cli';


interface Context {
  dependencies: SingleDependency[];
  bin: CliLink[];
}

const linkExecutable = <T extends Context>(): ListrTask<T, typeof DefaultRenderer> => ({
  title: 'Creating links for CLI dependencies.',
  task: (ctx, task) => {
    task.output = 'Creating links';

    ctx.bin = linkCLI(ctx.dependencies);

    writeLinks(ctx.bin);
    
    task.output = `Created ${ctx.bin.length} links`;
  }
});


export default linkExecutable;
