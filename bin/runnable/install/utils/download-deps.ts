/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 00:03:04 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 00:18:03
 */

import { ListrRenderer, ListrTask } from 'listr2';
import { TaskWrapper } from 'listr2/dist/lib/task-wrapper';
import * as path from 'path';
import * as fs from 'fs';
import * as semver from 'semver';
import * as compressing from 'compressing';
import { sync as mkdirp } from 'mkdirp';

import env from '../../../utils/env';
import request from '../../../utils/request';
import { VersionInfo } from '../../../utils/request/request-npm';
import progress, { ProgressTag } from './progress';


export const readDirAll = (dir: string): string[] => {
  const files: string[] = [];

  fs.readdirSync(dir).forEach(fn => {
    const p = path.join(dir, fn);

    if (fs.statSync(p).isDirectory()) {
      files.push(...readDirAll(p));
    } else {
      files.push(p);
    }
  });

  return files;
};

export interface InstallResult {
  name: string;
  version: string;
  err: Error | null;
  data?: {
    size: number;
    unpackedSize: number;
    /** where is me, absolute path */
    dir: string;
  };
  _request: {
    url: string;
  };
}

const MAX_ROWS = 6;

const batchDownload = (
  modules: VersionInfo[],
  onProgress?: (completed: string[], failed: string[], total: string[]) => void,
  onEnd?: (res: InstallResult) => void
): ListrTask[] => {
  const count = {
    completed: [] as string[],
    failed: [] as string[],
    total: modules.map(d => `${d.name}@${d.version}`)
  };

  const state: ProgressTag[] = modules.map(_ => ProgressTag.prepare);

  const canDisplay = (idx: number) => {
    if ([ProgressTag.done, ProgressTag.failed].includes(state[idx] as ProgressTag)) {
      return false;
    }
    
    let nowDisplaying = 0;

    for (let i = 0; i <= idx && i < state.length && nowDisplaying < MAX_ROWS; i += 1) {
      if (![ProgressTag.done, ProgressTag.failed].includes(state[i] as ProgressTag)) {
        nowDisplaying += 1;
      }
      if (nowDisplaying < MAX_ROWS && i === idx) {
        return true;
      }
    }

    return false;
  };

  const tasks = modules.map((mod, i): ListrTask => {
    const { name, version } = mod;
    const dir = path.join(
      env.resolvePath('.espoir', '.modules'),
      name,
      (semver.valid(semver.coerce(version)) as string).replace(/\./g, '_')
    );
    const url = mod.dist.tarball;
    const fn = url.split(/\/+/).reverse()[0] as string;
    const p = path.join(dir, fn);
    
    const updateLog = (
      task: TaskWrapper<unknown, typeof ListrRenderer>,
      tag: ProgressTag,
      value?: number
    ): void => {
      state[i] = tag;
      progress.set(name, tag, value ?? -1);
      
      if (canDisplay(i)) {
        task.output = progress.stringify(name, tag, value);
      }
    };
    
    const run = async (
      _ctx: unknown,
      task: TaskWrapper<unknown, typeof ListrRenderer>
    ): Promise<InstallResult> => {
      const reportFailed = (err: Error) => {
        updateLog(task, ProgressTag.failed);
        count.failed.push(`${name}@${version}`);
      };

      updateLog(task, ProgressTag.prepare);
      
      // download the .tgz file

      const [downloadErr, size] = await request.download(
        url,
        p,
        {},
        (done, total) => {
          updateLog(task, ProgressTag.download, total ? done / total : 0);
        }
      );
  
      if (downloadErr) {
        reportFailed(downloadErr);

        return {
          name,
          version,
          err: downloadErr,
          _request: {
            url
          }
        };
      }
      
      // un-compress the .tgz file and delete it after done

      try {
        updateLog(task, ProgressTag['un-compress'], 0);
        await compressing.tgz.uncompress(p, dir);
        fs.rmSync(p);
        updateLog(task, ProgressTag['un-compress'], 1);
      } catch (error) {
        reportFailed(error);

        return {
          name,
          version,
          err: error,
          _request: {
            url
          }
        };
      }

      // unpack ths downloaded package

      const pp = path.join(dir, 'package');
      
      if (fs.existsSync(pp)) {
        // some packages such as type declarations do not have a `/package` directory

        updateLog(task, ProgressTag.unpack, 0);

        const [unPackErr] = await new Promise<[Error, null] | [null, null]>(resolve => {
          try {
            const files = readDirAll(pp);

            files.forEach(_fn => {
              const _rp = path.relative(pp, _fn);
              const _to = path.join(dir, _rp);

              const _td = path.resolve(_to, '..');

              if (!fs.existsSync(_td)) {
                mkdirp(_td);
              }

              fs.renameSync(_fn, _to);
            });

            fs.rmdirSync(pp, {
              recursive: true
            });
            
            return resolve([null, null]);
          } catch (error) {
            return resolve([error, null]);
          }
        });

        if (unPackErr) {
          reportFailed(unPackErr);
          
          return {
            name,
            version,
            err: unPackErr,
            _request: {
              url
            }
          };
        }

        updateLog(task, ProgressTag.unpack, 1);
      }
      
      updateLog(task, ProgressTag.done); // FIXME: not here
      count.completed.push(`${name}@${mod.version}`);

      onProgress?.(count.completed, count.failed, count.total);

      return {
        name,
        version: mod.version,
        err: null,
        data: {
          size: size as number,
          unpackedSize: mod.dist.unpackedSize as number,
          /** where is me, absolute path */
          dir
        },
        _request: {
          url
        }
      };
    };

    return {
      task: async (ctx: unknown, task) => {
        const res = await run(ctx, task);

        onEnd?.(res);

        return;
      }
    };
  });

  return tasks;
};


export default batchDownload;
