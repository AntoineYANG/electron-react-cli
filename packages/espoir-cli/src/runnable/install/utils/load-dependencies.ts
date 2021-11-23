/*
 * @Author: Kanata You 
 * @Date: 2021-11-13 23:44:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:14:05
 */

import Logger from '@ui/logger';
import env, { PackageJSON } from '@env';


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

/**
 * Loads all the explicit dependencies from all `package.json`.
 */
const loadDependencies = (scopes: string[], isProd: boolean): SingleDependency[] => {
  const packages: PackageJSON[] = [];

  if (scopes.includes('root')) {
    packages.push(env.rootPkg);
  }

  env.packages.forEach(p => {
    const pkg = env.packageMap[p] as PackageJSON;

    if (scopes.includes(p)) {
      packages.push(pkg);
    }
  });

  const keys = [
    'dependencies',
    isProd ? null : 'devDependencies'
  ].filter(Boolean) as DependencyTag[];

  const dependencies = packages.reduce<Dependency[]>((list, pkgJSON) => {
    const data = getAllDependencies(pkgJSON, keys);

    return list.concat(data);
  }, []);

  return dependencies.map(d => {
    if (d.versions.length !== 1) {
      throw new Error(
        `Incompatible required versions found for "${d.name}": [${
          d.versions.map(v => `'${v}'`).join(', ')
        }]. `
      );
    }

    return {
      name: d.name,
      version: d.versions[0] as string
    };
  });;
};

export default loadDependencies;
