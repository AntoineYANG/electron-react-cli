/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 17:53:51 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 20:58:33
 */

import * as semver from 'semver';

import { NpmPackage, VersionInfo } from '../../../utils/request/request-npm';
import request from '../../../utils/request';
import { Dependency, MinIncompatibleSet, SingleDependency } from './read-deps';


/**
 * Returns available versions of a module.
 * Results is sorted by version in descending order.
 *
 * @param {string} name name of the module
 * @param {string} version semver range
 * @param {boolean} [noCache=false]
 * @returns {Promise<VersionInfo[]>}
 */
const getAvailableVersions = (
  name: string, version: string, noCache: boolean = false
): Promise<VersionInfo[]> => new Promise((resolve, reject) => {
  request.npm.view(
    name, {
      cache: !noCache
    }
  ).then(([err, data]) => {
    if (err) {
      return reject(err);
    }

    const versions = Object.entries(
      (data as NpmPackage).versions
    ).reduce<VersionInfo[]>((list, [v, d]) => {
      if (d.dist?.tarball && semver.satisfies(v, version)) {
        return [...list, d];
      }

      return list;
    }, []).sort(
      ((a, b) => (semver.lt(a.version, b.version) ? 1 : -1))
    );

    resolve(versions);
  });
});

// /**
//  * 
//  *
//  * @param {string} a
//  * @param {string} b
//  * @returns {(string | null)}
//  */
// const compatibleRange = (a: string, b: string): string | null => {};

// const minCompatibleSet = (versions: string[]): string[] => {
//   const results: string[] = [];

  

//   return results;
// };

/**
 * Returns the minimum incompatible set of the dependency.
 *
 * @param {Dependency} dependency
 * @param {boolean} [noCache=false]
 * @returns {Promise<MinIncompatibleSet>}
 */
export const getMinIncompatibleSet = async (
  dependency: Dependency, noCache: boolean = false
): Promise<MinIncompatibleSet> => {
  const minSet: MinIncompatibleSet = [];

  dependency.versions.map(v => {
    return getAvailableVersions(dependency.name, v, noCache);
  }, []);

  const satisfied = (await Promise.all(
    dependency.versions.map(v => {
      return getAvailableVersions(dependency.name, v, noCache);
    }, [])
  )) as [VersionInfo, ...VersionInfo[]][];

  // FIXME:
  satisfied.forEach(sl => {
    minSet.push({
      name: sl[0].name,
      version: sl[0].version
    });
  });
  
  return minSet;
};

/**
 * Resolves all the implicit dependencies.
 *
 * @param {SingleDependency[]} dependencies
 * @param {VersionInfo[]} [memoized=[]]
 * @param {boolean} [noCache=false]
 * @returns {Promise<VersionInfo[]>}
 */
export const resolveDependencies = async (
  dependencies: SingleDependency[],
  memoized: VersionInfo[] = [],
  noCache: boolean = false
): Promise<VersionInfo[]> => {
  const data: VersionInfo[] = [...memoized];
  const entering: VersionInfo[] = [];

  const unresolved: Dependency[] = [];

  const tasks = dependencies.map(async dep => {
    const isDeclared = () => Boolean(
      data.find(
        d => d.name === dep.name && semver.satisfies(d.version, dep.version)
      )
    );
    
    if (isDeclared()) {
      // this dependency is already resolved
      return;
    }

    const satisfied = await getAvailableVersions(dep.name, dep.version, noCache);
    
    if (isDeclared()) {
      // this dependency is already resolved when checking
      return;
    }

    // FIXME: pick the most suitable one
    const target = satisfied[0] as VersionInfo;

    // add it to the list
    entering.push(target);

    return;
  });
  
  await Promise.all(tasks);

  if (entering.length) {
    data.push(...entering);
  
    // collect the dependencies of the entered items
    entering.forEach(item => {
      Object.entries(item.dependencies ?? {}).forEach(([name, range]) => {
        const satisfied = data.find(
          d => d.name === name && semver.satisfies(d.version, range)
        );
    
        if (!satisfied) {
          const declared = unresolved.find(
            d => d.name === name
          );
    
          if (declared) {
            if (!declared.versions.includes(range)) {
              declared.versions.push(range);
            }
          } else {
            unresolved.push({
              name,
              versions: [range]
            });
          }
        }
      });
    });

    // resolve them
    const items = (
      await Promise.all(
        unresolved.map(d => getMinIncompatibleSet(d, noCache))
      )
    ).flat(1);
    
    const results = await resolveDependencies(items, data, noCache);
  
    data.push(...results);
  }

  return data;
};
