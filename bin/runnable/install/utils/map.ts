/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 20:00:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 23:36:00
 */

import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { sync as mkdirp } from 'mkdirp';
import * as semver from 'semver';

import env, { PackageJSON } from '../../../utils/env';
import { InstallResult } from './download-deps';
import { LockData, LockInfo, LockItem } from './lock';
import { Dependency } from './read-deps';


const link = async (at: string, to: string): Promise<string> => {
  const dir = path.resolve(at, '..');

  if (process.platform === 'win32') {
    return new Promise<string>((resolve, reject) => {
      if (!fs.existsSync(dir)) {
        mkdirp(dir);
      } else if (fs.existsSync(at)) {
        fs.rmSync(
          at, {
            recursive: true,
            force: true
          }
        );
      }

      child_process.exec(
        `mklink /j "${at}" "${to}"`,
        err => {
          if (err) {
            return reject(err);
          }

          return resolve(at);
        }
      );
    });
  }

  return Promise.reject(new Error(`Cannot create links on ${process.platform}`));
};

/**
 * Links installed modules to /node_modules/.
 *
 * @param {string[]} explicit names of dependencies explicitly declared
 * @param {LockData} lockData generated lock data
 * @param {InstallResult[]} installResults results of installation
 */
const map = async (explicit: Dependency[], lockData: LockData, installResults: InstallResult[]) => {
  const modulesDir = env.resolvePath('node_modules_');

  const outer = [...explicit];

  const whereIs = (name: string): string | null => {
    const decl = outer.findIndex(d => d.name === name);

    if (decl !== -1) {
      // Note that according to the order of the resolved dependencies,
      // The modules declared in `package.json` / CLI must be in front of the others.
      outer.splice(decl);

      return path.join(modulesDir, name);
    }

    return null;
  };

  const linking: Promise<string>[] = [];

  Object.entries(lockData).forEach(([name, versions]) => {
    Object.entries(versions).forEach(([v, d]) => {
      const p = whereIs(name);
      
      const t = installResults.find(r => {
        return r.data && r.name === name && semver.satisfies(r.version, v);
      });

      d.target = t?.data?.dir ?? '';

      if (!p) {
        d.path = d.target;
        return;
      }

      d.path = p;

      linking.push(
        link(d.path, d.target)
      );
    });
  });

  const deps = await Promise.all(linking);

  // FIXME: 先遍历下载目录，再链接过去

  const linking2: Promise<string>[] = [];

  deps.forEach(dep => {
    const fn = path.join(dep, 'package.json');
    
    if (fs.existsSync(fn)) {
      const { dependencies = null } = JSON.parse(
        fs.readFileSync(fn, { encoding: 'utf-8'})
      ) as PackageJSON;

      if (dependencies) {
        const _dir = path.join(dep, 'node_modules');

        if (fs.existsSync(_dir)) {
          fs.rmSync(
            _dir, {
              recursive: true,
              force: true
            }
          );
        }

        mkdirp(_dir);

        Object.entries(dependencies).forEach(([k, v]) => {
          const what = lockData[k] as LockItem;
          const which = what[
            (Object.entries(what).find(([vi]) => {
              return semver.satisfies(vi, v);
            }) as [string, LockInfo])[0]
          ] as LockInfo;

          const _p = path.join(_dir, k);

          linking2.push(
            link(_p, which.target)
          );
        });
      }
    }
  });

  await Promise.all(linking2);
};


export default map;
