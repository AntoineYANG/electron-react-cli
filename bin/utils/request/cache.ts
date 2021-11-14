/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 23:23:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:33:00
 */

import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

import env from '../../utils/env';


export type RequestCache = {
  url: string;
  resp: any;
  expiresTime: number;
};

const cache: RequestCache[] = [];

export type RequestMemo = {
  url: string;
  resp: any;
}

const memo: RequestMemo[] = [];

// load local cache
const loadLocalCache = () => {
  const dir = path.join(
    env.configs.cacheDir,
    '.espoir',
    '.cache'
  );

  if (!fs.existsSync(dir)) {
    mkdirp(dir);
    return;
  }

  const fn = path.join(
    dir,
    'requests.json'
  );
  
  fs.readFile(
    fn, {
      encoding: 'utf-8'
    }, (err, data) => {
      if (err) {
        return;
      }

      const content = (JSON.parse(data) as RequestCache[]).filter(
        d => d.expiresTime >= Date.now()
      );

      content.forEach(d => cache.push(d));
    }
  );
};

loadLocalCache();

export const writeLocalCache = (
  url: string, resp: any, expires: number, filter: (data: any) => any
): void => {
  cache.push({
    url,
    resp: filter(resp),
    expiresTime: Date.now() + expires
  });
  
  fs.writeFileSync(
    path.join(
      env.configs.cacheDir,
      '.espoir',
      '.cache',
      'requests.json'
    ), JSON.stringify(
      cache
    ), {
      encoding: 'utf-8'
    }
  );
};

export const useLocalCache = <T>(url: string): T | null => {
  const found = cache.find(d => d.url === url);

  if (found) {
    return found.resp as T;
  }

  return null;
};

export const memoize = (url: string, resp: any, filter: (data: any) => any): void => {
  memo.push({
    url,
    resp: filter(resp)
  });
};

export const useMemoized = <T>(url: string): T | null => {
  const found = memo.find(d => d.url === url);

  if (found) {
    return found.resp as T;
  }

  return null;
};
