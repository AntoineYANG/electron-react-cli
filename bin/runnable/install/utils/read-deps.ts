/*
 * @Author: Kanata You 
 * @Date: 2021-11-13 23:44:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-18 11:19:17
 */

import Logger from '../../../utils/ui/logger';
import { PackageJSON } from '../../../utils/env';


export type Dependency = {
  name: string;
  versions: string[];
};

export type SingleDependency = {
  name: string;
  version: string;
};

export type FailedDependency = SingleDependency & {
  reasons: Error[];
};

export type MinIncompatibleSet = SingleDependency[];

export type DependencyTag = (
  'dependencies' | 'devDependencies'
);

export type DependencySet = {
  [name: string]: string;
};

const keysNotAllowedInRoot: DependencyTag[] = [
  'dependencies'
];

/**
 * Returns all the explicit dependencies.
 *
 * @param {PackageJSON} pkgJSON
 * @param {DependencyTag[]} keys
 * @returns {Dependency[]}
 */
export const getAllDependencies = (pkgJSON: PackageJSON, keys: DependencyTag[]): Dependency[] => {
  const isRoot = Boolean(pkgJSON.private);
  const dependencies: Dependency[] = [];

  keys.forEach(key => {
    if (isRoot && keysNotAllowedInRoot.includes(key) && pkgJSON[key]) {
      Logger.warn(
        `\`${key}\` in root \`package.json\` is found, which is not suggested. `
        + 'Move them to `devDependencies` or any child package instead. '
      );
      
      return;
    }

    Object.entries(pkgJSON[key] ?? {}).forEach(([name, version]) => {
      const declared = dependencies.find(d => d.name === name);

      if (declared) {
        // the module is already declared
        if (!declared.versions.includes(version)) {
          declared.versions.push(version);
        }
      } else {
        dependencies.push({
          name,
          versions: [version]
        });
      }
    });
  });

  return dependencies;
};
