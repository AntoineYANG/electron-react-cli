/*
 * @Author: Kanata You 
 * @Date: 2021-11-20 22:38:50 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 23:38:00
 */

import * as semver from 'semver';

import { SingleDependency } from './load-dependencies';


const parseDependencies = (moduleNames: string[]): SingleDependency[] => {
  const results: SingleDependency[] = [];

  for (const raw of moduleNames) {
    const match = /^(?<name>@?[^@]+)(@(?<range>[^@]+))?$/.exec(raw);

    if (!match) {
      throw new Error(`Cannot parse "${raw}". `);
    }

    const { name, range } = match.groups as { name: string; range?: string };

    if (!range) {
      results.push({
        name,
        version: '*'
      });
    } else {
      if (range === 'latest') {
        results.push({
          name,
          version: 'latest'
        });

        continue;
      }

      const validRange = semver.validRange(range);

      if (!validRange) {
        throw new Error(`"${range}" is not a valid range. `);
      }

      results.push({
        name,
        version: validRange
      });
    }
  }

  return results;
};


export default parseDependencies;
