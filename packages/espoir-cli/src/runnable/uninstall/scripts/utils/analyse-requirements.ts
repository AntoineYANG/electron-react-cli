/*
 * @Author: Kanata You 
 * @Date: 2022-01-12 21:49:46 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 23:54:41
 */

import * as semver from 'semver';

import env, { PackageJSON } from '@env';
import type { DependencyTag, SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';


export interface Requirement {
  module: SingleDependency;
  location: string;
  link?: string;
  packages: string[];
  required: string[];
  requiring: {
    [name: string]: string;
  };
}

const analyseRequirements = (lockData: LockData): Requirement[] => {
  const res: Requirement[] = [];
  
  Object.entries(lockData).forEach(([name, item]) => {
    Object.entries(item).forEach(([v, info]) => {
      res.push({
        module: {
          name,
          version: v
        },
        location: info.target,
        link: info.entry as string,
        packages: [],
        required: [],
        requiring: info.requires
      });
    });
  });

  // record dependence between modules
  Object.entries(lockData).forEach(([name, item]) => {
    Object.entries(item).forEach(([v, info]) => {
      Object.entries(info.requires).forEach(([_name, _range]) => {
        const which = res.find(
          ({ module: m }) => m.name === _name && semver.satisfies(m.version, _range)
        );

        which?.required.push(`${name}@${v}`);
      });
    });
  });

  // record dependence between modules and local packages
  env.packages.map(pn => env.packageMap[pn] as PackageJSON).forEach((pkg, i) => {
    const name = pkg.name ?? env.packages[i] as string;

    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(k => {
      const deps = pkg[k as DependencyTag] ?? {};

      Object.entries(deps).forEach(([_name, _range]) => {
        const which = res.find(
          ({ module: m }) => m.name === _name && semver.satisfies(m.version, _range)
        );

        which?.packages.push(name);
      });
    });
  });

  return res;
};


export default analyseRequirements;
