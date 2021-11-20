/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 20:00:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 22:17:01
 */

import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { sync as mkdirp } from 'mkdirp';
import * as semver from 'semver';

import env from '../../../utils/env';
import { InstallResult } from './download-deps';
import { LockData, LockInfo, LockItem } from './lock';
import { Dependency } from './load-dependencies';


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

      try {
        fs.readdirSync(to);
      } catch (error) {
        return reject(error);
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
const map = async (
  explicit: Dependency[], lockData: LockData, installResults: InstallResult[]
): Promise<string[]> => {
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

  // mark the explicit dependencies
  Object.entries(lockData).forEach(([name, versions]) => {
    Object.entries(versions).forEach(([v, d]) => {
      if (d.target) {
        // already downloaded
        return;
      }

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

  // link the dependencies in each module in the download directory
  Object.entries(lockData).forEach(([name, versions]) => {
    Object.entries(versions).forEach(([v, d]) => {
      const p = whereIs(name);

      if (!p) {
        // create links in download directory

        const { requires } = d;

        if (Object.keys(requires).length) {
          const _dir = path.join(d.target, 'node_modules');

          if (fs.existsSync(_dir)) {
            fs.rmSync(
              _dir, {
                recursive: true,
                force: true
              }
            );
          }
  
          Object.entries(requires).forEach(([name, range]) => {
            const what = lockData[name] as LockItem;
            const which = what[
              (Object.entries(what).find(([wv]) => {
                return semver.satisfies(wv, range);
              }) as [string, LockInfo])[0]
            ] as LockInfo;

            linking.push(
              link(path.join(_dir, name), which.target)
            );
          });
        }


        return;
      }

      d.path = p;

      linking.push(
        link(d.path, d.target)
      );
    });
  });

  const deps = await Promise.all(linking);

  return deps;
};


export default map;
