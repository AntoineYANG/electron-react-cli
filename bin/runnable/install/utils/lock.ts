/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 20:49:31 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:33:23
 */

import * as fs from 'fs';

import env from '../../../utils/env';
import { VersionInfo } from '../../../utils/request/request-npm';


export enum LockCheckFailedReason {
  FILES_NOT_FOUND = 1,
}

export type LockInfo = {
  resolved: string;
  /** exported link */
  entry?: string;
  /** real path */
  target: string;
  integrity: string;
  requires: {
    [name: string]: string;
  };
  failed?: LockCheckFailedReason;
};

export type LockItem = {
  [version: string]: LockInfo;
};

export type LockData = {
  [name: string]: LockItem;
};

/**
 * Generates espoir lock data from version info.
 *
 * @param {LockData} origin
 * @param {VersionInfo[]} data
 * @returns {LockData}
 */
export const createLockData = (origin: LockData, data: VersionInfo[]): LockData => {
  const result = origin;

  data.forEach(d => {
    if (!result[d.name]) {
      result[d.name] = {};
    }

    const thisModule = result[d.name] as LockItem;

    if (thisModule[d.version]) {
      if (!d.lockInfo?.failed) {
        throw new Error(`"${d.name}@${d.version}" is already recorded in lock file. `);
      }
      // else: overwrite
    }

    thisModule[d.version] = {
      resolved: d.dist.tarball,
      integrity: d.dist.integrity,
      target: '', // `target` will be assigned after calling map()
      requires: {}
    };
    
    const requires = thisModule[d.version]?.requires as LockInfo['requires'];

    Object.entries(d.dependencies ?? {}).forEach(([name, range]) => {
      requires[name] = range;
    });
  });

  return result;
};

const validateLockData = (data: LockData): boolean => {
  Object.entries(data).forEach(([name, item]) => {
    Object.entries(item).forEach(([v, d]) => {
      if (!d.target || !fs.existsSync(d.target)) {
        throw new Error(
          `Files of "${name}@${v}" (path='${d.target}') might be broken. `
        );
      }

      if (d.entry && !fs.existsSync(d.entry)) {
        throw new Error(
          `Module entry of "${name}@${v}" (path='${d.target}') might be broken. `
        );
      }
    });
  });

  return true;
};

const dir = env.resolvePath('.espoir');
const fn = env.resolvePath('.espoir', 'espoir-lock.json');

/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {LockData} data
 */
export const writeLockFile = (data: LockData): void => {
  if (!validateLockData(data)) {
    return;
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const sorted: LockData = {};

  Object.entries(data).sort(
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
    sorted[k] = v;
  });

  fs.writeFileSync(
    fn,
    JSON.stringify(
      sorted,
      undefined,
      2
    ),
    {
      encoding: 'utf-8'
    }
  );
};

export const useLockFileData = (): LockData => {
  if (fs.existsSync(fn)) {
    return JSON.parse(
      fs.readFileSync(
        fn, {
          encoding: 'utf-8'
        }
      )
    ) as LockData;
  }

  return {};
};
