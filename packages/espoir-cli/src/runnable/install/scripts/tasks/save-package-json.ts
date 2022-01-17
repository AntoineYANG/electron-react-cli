/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:51:29 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:54:15
 */

import * as semver from 'semver';

import type { ListrTask, ListrRendererFactory } from 'listr2';
import type { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import savePackageDeps from '@@install/utils/save-package-deps';


interface Context {
  dependencies: SingleDependency[];
  lockData: LockData;
}

const savePackageJSON = <T extends Context>(
  scopes: string[],
  tag: 'dependencies' | 'devDependencies'
): ListrTask<T, ListrRendererFactory> => ({
  title: 'Saving package dependencies.',
  task: (ctx, task) => {
    task.output = 'Saving package.json';
    const deps = ctx.dependencies.map(dep => {
      const required = semver.validRange(dep.version) as string;
      const installed = Object.keys(ctx.lockData[dep.name] ?? {})?.[0];

      if (!installed || !semver.satisfies(installed, required)) {
        return null;
      }

      const realRange = `^${installed}`;

      const supposedRange = semver.subset(realRange, required) ? realRange : required;

      return {
        name: dep.name,
        version: supposedRange
      }
    }).filter(Boolean) as SingleDependency[];
    savePackageDeps(deps, scopes, tag);
    task.output = 'Package dependencies updated';
  }
});


export default savePackageJSON;
