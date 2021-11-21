/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:54:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 01:23:24
 */

import * as fs from 'fs';

import env, { PackageJSON } from '../../../utils/env';
import { DependencySet, SingleDependency } from './load-dependencies';


export type DependencyTag = (
  'dependencies' | 'devDependencies'
);

const savePackageDeps = (
  deps: SingleDependency[],
  scopes: string[],
  tag: 'dependencies' | 'devDependencies'
) => {
  scopes.forEach(scope => {
    const fn = scope === 'root' ? env.resolvePath('package.json') : (
      env.resolvePathInPackage(scope, 'package.json')
    );
    
    if (!fs.existsSync(fn)) {
      throw new Error(
        `Cannot find package.json for ${
          scope === 'root' ? 'workspace root' : `package ${scope}`
        }. `
      );
    }

    const data = JSON.parse(
      fs.readFileSync(
        fn, {
          encoding: 'utf-8'
        }
      )
    ) as PackageJSON;

    const { dependencies, devDependencies } = data;

    deps.forEach(dep => {
      if (dependencies?.[dep.name]) {
        dependencies[dep.name] = undefined as unknown as string;
      }

      if (devDependencies?.[dep.name]) {
        devDependencies[dep.name] = undefined as unknown as string;
      }
      
      const result: DependencySet = {};

      ([
        ...Object.entries(data[tag] ?? {}),
        [dep.name, dep.version]
      ] as [string, string][]).sort(
        (a, b) => {
          const an = a[0];
          const bn = b[0];

          for (let i = 0; i < an.length && i < bn.length; i += 1) {
            const ac = an.charCodeAt(i);
            const bc = bn.charCodeAt(i);

            if (ac !== bc) {
              return ac - bc;
            }
          }

          return an.length - bn.length;
        }
      ).forEach(([k, v]) => {
        result[k] = v;
      });

      data[tag] = result;
    });

    fs.writeFileSync(
      fn,
      JSON.stringify(
        data,
        undefined,
        2
      ) + '\n'
    );
  });
};


export default savePackageDeps;
