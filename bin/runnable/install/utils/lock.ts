/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 20:49:31 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:01:44
 */

import * as fs from 'fs';

import env from '../../../utils/env';
import { VersionInfo } from '../../../utils/request/request-npm';


export type LockRequireData = {
  range: string;
  target: string;
};

export type LockInfo = {
  resolved: string;
  requires: {
    [name: string]: LockRequireData;
  }
};

export type LockItem = {
  [version: string]: LockInfo;
};

export type LockData = {
  [name: string]: LockItem;
};

const createLockData = (data: VersionInfo[]): LockData => {
  const result = {} as LockData;

  data.forEach(d => {
    if (!result[d.name]) {
      result[d.name] = {};
    }

    const thisModule = result[d.name] as LockItem;

    thisModule[d.version] = {
      resolved: d.dist.tarball,
      requires: {}
    };
    
    const requires = thisModule[d.version]?.requires as LockInfo['requires'];

    Object.entries(d.dependencies ?? {}).forEach(([name, range]) => {
      requires[name] = {
        range,
        target: '' // FIXME:
      }
    });
  });

  return result;
};

const dir = env.resolvePath('.espoir');
const fn = env.resolvePath('.espoir', 'espoir-lock.json');

/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {VersionInfo[]} data
 */
export const writeLockFile = (data: VersionInfo[]): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(
    fn,
    JSON.stringify(
      createLockData(data),
      undefined,
      2
    ),
    {
      encoding: 'utf-8'
    }
  );
};
