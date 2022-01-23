/*
 * @Author: Kanata You 
 * @Date: 2022-01-12 23:02:33 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:16:51
 */

import * as fs from 'fs';

import env, { PackageJSON } from '@env';
import type { DependencyTag } from '@@install/utils/load-dependencies';


const delDep = (from: string, name: string): void => {
  if (!env.packageMap) {
    throw new Error(
      `You're outside a espoir workspace.`
    );
  }

  const fn = from === 'root' ? env.resolvePath('package.json') : env.resolvePathInPackage(from, 'package.json');
  const data = (from === 'root' ? env.rootPkg : env.packageMap[from]) as PackageJSON;

  let write = false;

  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(k => {
    if (data[k]) {
      const {
        [name]: _,
        ...deps
      } = data[k as DependencyTag] ?? {};

      data[k] = deps;

      write = true;

      if (k === 'peerDependencies') {
        if (data.peerDependenciesMeta) {
          const {
            [name]: _,
            ...meta
          } = data.peerDependenciesMeta;

          data.peerDependenciesMeta = meta;
        }
      }
    }
  });

  if (write) {
    fs.writeFileSync(
      fn,
      JSON.stringify(data, undefined, 2) + '\n', {
        encoding: 'utf-8'
      }
    );
  }
};


export default delDep;
