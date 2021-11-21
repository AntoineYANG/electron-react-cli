/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:51:29 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 01:22:20
 */

import * as semver from 'semver';

import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { LockData } from '../../utils/lock';
import type { SingleDependency } from '../../utils/load-dependencies';
import savePackageDeps from '../../utils/save-package-deps';


const savePackageJSON = <T extends {
  dependencies: SingleDependency[];
  lockData: LockData;
}>(
  scopes: string[],
  tag: 'dependencies' | 'devDependencies'
): ListrTask<T, typeof DefaultRenderer> => ({
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
