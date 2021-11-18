/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 17:53:51 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-18 14:27:58
 */

import * as semver from 'semver';

import { NpmPackage, VersionInfo } from '../../../utils/request/request-npm';
import request from '../../../utils/request';
import { Dependency, FailedDependency, MinIncompatibleSet, SingleDependency } from './read-deps';


/**
 * Returns available versions of a module.
 * Results is sorted by version in descending order.
 *
 * @param {string} name name of the module
 * @param {string} version semver range
 * @param {boolean} [noCache=false]
 * @returns {Promise<[null, VersionInfo[]] | [Error, null]>}
 */
const getAvailableVersions = (
  name: string, version: string, noCache: boolean = false
): Promise<[null, VersionInfo[]] | [Error, null]> => new Promise(resolve => {
  request.npm.view(
    name, {
      cache: !noCache
    }
  ).then(([err, data]) => {
    if (err) {
      return resolve([err, null]);
    }

    const tagged = Object.values(
      data?.['dist-tags'] ?? {}
    );

    const versions = Object.entries(
      (data as NpmPackage).versions
    ).reduce<VersionInfo[]>((list, [v, d]) => {
      const td = tagged.findIndex(_v => v === _v);

      if (td !== -1) {
        tagged.splice(td);
      }

      if (d.dist?.tarball && semver.satisfies(v, version)) {
        return [...list, d];
      }

      return list;
    }, []);

    if (tagged.length) {
      Promise.all(
        tagged.map(td => {
          return request.npm.find(name, td);
        })
      ).then(list => {
        list.forEach(t => {
          if (t[1]) {
            versions.push(t[1] as unknown as VersionInfo);
          }
        });

        resolve([
          null,
          versions.sort(
            ((a, b) => (semver.lt(a.version, b.version) ? 1 : -1))
          )
        ]);
      });
    } else {
      resolve([
        null,
        versions.sort(
          ((a, b) => (semver.lt(a.version, b.version) ? 1 : -1))
        )
      ]);
    }
  });
});

/**
 * Returns the minimum incompatible set of the dependency.
 *
 * @param {Dependency} dependency
 * @param {boolean} [noCache=false]
 * @returns {Promise<MinIncompatibleSet>}
 */
export const getMinIncompatibleSet = async (
  dependency: Dependency, noCache: boolean = false
): Promise<{ value: MinIncompatibleSet; failed: Error[]; }> => {
  const minSet: MinIncompatibleSet = [];
  const failed: Error[] = [];

  // map: range => declared versions
  const versions: Record<string, string[]> = dependency.versions.reduce<Record<string, string[]>>(
    (prev, v) => {
      const curFloor = semver.minVersion(v);

      if (curFloor) {
        const curMajor = semver.major(curFloor);
        const curMinor = semver.minor(curFloor);

        const label = `${curMajor}.${curMinor}`;

        if (prev[label]) {
          if ((prev[label] as string[]).includes(v)) {
            return prev;
          }

          (prev[label] as string[]).push(v);
        } else {
          prev[label] = [v];
        }
      }

      return prev;
    },
    {}
  );

  const satisfied = (await Promise.all(

    dependency.versions.map<Promise<VersionInfo[] | null>>(async v => {
      const [err, list] = await getAvailableVersions(dependency.name, v, noCache);
      
      if (err) {
        failed.push(err);

        return null;
      }

      return list as VersionInfo[];
    })
  )).filter(Boolean) as VersionInfo[][];

  // FIXME:
  satisfied.forEach(sl => {
    if (sl.length) {
      minSet.push({
        name: (sl[0] as VersionInfo).name,
        version: (sl[0] as VersionInfo).version
      });
    }
  });
  
  return {
    value: minSet,
    failed
  };
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
  noCache: boolean = false,
  onProgress?: (resolved: number, unresolved: number) => void
): Promise<{ succeeded: VersionInfo[]; failed: FailedDependency[] }> => {
  const data: VersionInfo[] = [...memoized];
  const entering: VersionInfo[] = [];

  const unresolved: Dependency[] = [];
  let running = 0;

  const failed: FailedDependency[] = [];

  const tasks = dependencies.map(async dep => {
    const isDeclared = () => Boolean(
      entering.find(
        d => d.name === dep.name && semver.satisfies(d.version, dep.version)
      )
    ) || Boolean(
      data.find(
        d => d.name === dep.name && semver.satisfies(d.version, dep.version)
      )
    );
    
    if (isDeclared()) {
      // this dependency is already resolved
      return;
    }

    running += 1;

    const [err, satisfied] = await getAvailableVersions(dep.name, dep.version, noCache);

    running -= 1;

    onProgress?.(data.length + entering.length + 1, running + entering.length);
    
    if (isDeclared()) {
      // this dependency is already resolved when checking
      return;
    }

    if (err || ((satisfied?.length ?? 0) === 0)) {
      // there's no versions satisfying the required range
      failed.push({
        ...dep,
        reasons: err ? [err] : [
          new Error(`no versions satisfy ${dep.version} for ${dep.name}`)
        ]
      });

      return;
    }

    // FIXME: pick the most suitable one
    const target = (satisfied as VersionInfo[])[0] as VersionInfo;
    
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
        unresolved.map(async d => {
          const { value, failed: f } = await getMinIncompatibleSet(d, noCache);
          
          if (f.length) {
            d.versions.forEach(v => {
              failed.push({
                name: d.name,
                version: v,
                reasons: f
              });
            });

            return null;
          }
          
          return value;
        })
      )
    ).flat(1).filter(Boolean) as SingleDependency[];

    onProgress?.(data.length, items.length);
    
    const results = await resolveDependencies(items, data, noCache, onProgress);
  
    data.push(...results.succeeded.filter(r => {
      return !Boolean(
        entering.find(
          d => d.name === r.name && semver.satisfies(d.version, r.version)
        )
      ) && !Boolean(
        data.find(
          d => d.name === r.name && semver.satisfies(d.version, r.version)
        )
      );
    }));

    failed.push(...results.failed);
  }
  
  return {
    succeeded: data,
    failed
  };
};
