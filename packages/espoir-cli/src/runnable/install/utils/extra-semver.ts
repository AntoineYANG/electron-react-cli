/*
 * @Author: Kanata You 
 * @Date: 2021-11-18 13:09:14 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-19 00:46:39
 */

import * as semver from 'semver';


export const coalesce = (prev: string, entering: string): string | null => {
  if (semver.intersects(prev, entering)) {
    if (semver.subset(prev, entering)) {
      return prev;
    }

    if (semver.subset(entering, prev)) {
      return entering;
    }
    
    return semver.validRange(`${prev} ${entering}`);
  }

  return null;
};

/**
 * Gets the minimum incompatible set of the given ranges.
 */
export const coalesceVersions = (ranges: string[]): string[] => {
  if (ranges.length < 2) {
    return ranges.map(d => semver.validRange(d)) as string[];
  }

  const fullSet = [...ranges];
  const results: string[] = [];

  fullSet.forEach(set => {
    for (let i = 0; i < results.length; i += 1) {
      const coalesced = coalesce(results[i] as string, set);

      if (coalesced) {
        // move the matched one, and insert the coalesced set, then break
        results.splice(i, 1, semver.validRange(coalesced) as string);

        return;
      }
    }

    // no one matches
    results.push(semver.validRange(set) as string);
  });

  return results;
};
