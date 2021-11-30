/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 19:15:56 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-30 19:32:42
 */

import env, { PackageJSON } from '@env';


/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {string[]}
 */
const getRunnableScripts = (scope?: string): string[] => {
  if (scope) {
    const res = scope === 'root' ? (
      Object.keys(env.rootPkg.scripts ?? {}).map(n => `root.${n}`)
    ) : (
      Object.keys((env.packageMap[scope] as PackageJSON).scripts ?? {}).map(n => `${scope}.${n}`)
    );

    return res.sort(
      (a, b) => {
        for (let i = 0; i < a.length && i < b.length; i += 1) {
          if (a.charCodeAt(i) !== b.charCodeAt(i)) {
            return a.charCodeAt(i) - b.charCodeAt(i);
          }
        }

        return a.length - b.length;
      }
    );
  }

  const allScripts: string[] = [];

  allScripts.push(
    ...Object.keys(env.rootPkg.scripts ?? {}).map(n => `root.${n}`)
  );

  env.packages.forEach(p => {
    allScripts.push(
      ...Object.keys((env.packageMap[p] as PackageJSON).scripts ?? {}).map(n => `${p}.${n}`)
    );
  });

  return allScripts.sort(
    (a, b) => {
      for (let i = 0; i < a.length && i < b.length; i += 1) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
          return a.charCodeAt(i) - b.charCodeAt(i);
        }
      }

      return a.length - b.length;
    }
  );
};

export default getRunnableScripts;
