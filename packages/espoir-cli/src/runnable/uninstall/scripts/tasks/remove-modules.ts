/*
 * @Author: Kanata You 
 * @Date: 2022-01-12 21:27:16 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 23:43:04
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';

import type { SingleDependency } from '@@install/utils/load-dependencies';
import { LockData, useLockFileData } from '@@install/utils/lock';
import type { Requirement } from '@@uninstall/scripts/utils/analyse-requirements';
import analyseRequirements from '@@uninstall/scripts/utils/analyse-requirements';
import rmModules from '@@uninstall/scripts/utils/rm-module';


interface Context {
  lockData: LockData;
  requirements: Requirement[];
  removed: string[];
}

const removeModules = <T extends Context>(
  modules: string[],
  packages: string[]
): ListrTask<T, ListrRendererFactory> => ({
  title: 'Removing modules.',
  task: (ctx, task) => {
    ctx.lockData = useLockFileData();
    ctx.requirements = analyseRequirements(ctx.lockData);

    let deleted: string[] = [];
    
    const subtasks = packages.map<ListrTask<any, any>>(pkg => {
      return {
        task: (_ctx: unknown, subtask) => {
          subtask.output = `Removing modules in "${pkg}"`;
          
          const deps = modules.reduce<SingleDependency[]>((list, name) => {
            return list;
          }, []);
          
          const res = rmModules(
            ctx.lockData,
            ctx.requirements,
            pkg,
            deps
          );

          deleted.push(...res.deleted);

          ctx.lockData = res.lockData;
          ctx.requirements = res.requirements;
          
          subtask.output = `Removed ${res.deleted.length} modules in "${pkg}"`;
          
          return;
        }
      };
    });

    return task.newListr(
      subtasks, {
        concurrent: false,
        rendererOptions: {
          clearOutput: true,
          collapse: true
        }
      }
    );
  }
});


export default removeModules;
