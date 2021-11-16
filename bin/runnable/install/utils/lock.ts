/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 20:49:31 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 20:57:02
 */

import * as fs from 'fs';

import env from '../../../utils/env';
import { VersionInfo } from '../../../utils/request/request-npm';


export type LockInfo = {
  resolved: string;
  path: string;
  target: string;
  integrity: string;
  requires: {
    [name: string]: string;
  }
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
 * @param {VersionInfo[]} data
 */
export const createLockData = (data: VersionInfo[]): LockData => {
  const result = {} as LockData;

  data.forEach(d => {
    if (!result[d.name]) {
      result[d.name] = {};
    }

    const thisModule = result[d.name] as LockItem;

    thisModule[d.version] = {
      resolved: d.dist.tarball,
      integrity: d.dist.integrity,
      path: '', // `path` will be assigned after calling map()
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

const dir = env.resolvePath('.espoir');
const fn = env.resolvePath('.espoir', 'espoir-lock.json');

/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {LockData} data
 */
export const writeLockFile = (data: LockData): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(
    fn,
    JSON.stringify(
      data,
      undefined,
      2
    ),
    {
      encoding: 'utf-8'
    }
  );
};
