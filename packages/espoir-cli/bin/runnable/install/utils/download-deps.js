"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 00:03:04
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:01:31
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readDirAll = void 0;

const path = require("path");

const fs = require("fs");

const semver = require("semver");

const compressing = require("compressing");

const mkdirp_1 = require("mkdirp");

const _env_1 = require("../../../utils/env");

const _request_1 = require("../../../utils/request");

const progress_1 = require("./progress");

const readDirAll = dir => {
  const files = [];
  fs.readdirSync(dir).forEach(fn => {
    const p = path.join(dir, fn);

    if (fs.statSync(p).isDirectory()) {
      files.push(...(0, exports.readDirAll)(p));
    } else {
      files.push(p);
    }
  });
  return files;
};

exports.readDirAll = readDirAll;
const MAX_ROWS = 8;

const batchDownload = (modules, onProgress, onEnd) => {
  const count = {
    completed: [],
    failed: [],
    total: modules.map(d => `${d.name}@${d.version}`)
  };
  const state = modules.map(_ => progress_1.ProgressTag.prepare);

  const canDisplay = idx => {
    if ([progress_1.ProgressTag.done, progress_1.ProgressTag.failed].includes(state[idx])) {
      return false;
    }

    let nowDisplaying = 0;

    for (let i = 0; i <= idx && i < state.length && nowDisplaying < MAX_ROWS; i += 1) {
      if (![progress_1.ProgressTag.done, progress_1.ProgressTag.failed].includes(state[i])) {
        nowDisplaying += 1;
      }

      if (nowDisplaying < MAX_ROWS && i === idx) {
        return true;
      }
    }

    return false;
  };

  const tasks = modules.map((mod, i) => {
    const {
      name,
      version
    } = mod;
    const dir = path.join(_env_1.default.resolvePath('.espoir', '.modules'), name, semver.valid(semver.coerce(version)).replace(/\./g, '_'));
    const url = mod.dist.tarball;
    const fn = url.split(/\/+/).reverse()[0];
    const p = path.join(dir, fn);

    const updateLog = (task, tag, value) => {
      state[i] = tag;
      progress_1.default.set(name, tag, value ?? -1);

      if (canDisplay(i)) {
        task.title = progress_1.default.stringify(name, tag, value);
      } else {
        task.title = undefined;
      }
    };

    const run = async (_ctx, task) => {
      const reportFailed = err => {
        updateLog(task, progress_1.ProgressTag.failed);
        count.failed.push(`${name}@${version}`);
      };

      updateLog(task, progress_1.ProgressTag.prepare); // download the .tgz file

      const [downloadErr, size] = await _request_1.default.download(url, p, {}, (done, total) => {
        updateLog(task, progress_1.ProgressTag.download, total ? done / total : 0);
      });

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
      } // un-compress the .tgz file and delete it after done


      try {
        updateLog(task, progress_1.ProgressTag['un-compress'], 0);
        await compressing.tgz.uncompress(p, dir);
        fs.rmSync(p);
        updateLog(task, progress_1.ProgressTag['un-compress'], 1);
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
      } // unpack ths downloaded package


      const pp = path.join(dir, 'package');

      if (fs.existsSync(pp)) {
        // some packages such as type declarations do not have a `/package` directory
        updateLog(task, progress_1.ProgressTag.unpack, 0);
        const [unPackErr] = await new Promise(resolve => {
          try {
            const files = (0, exports.readDirAll)(pp);

            const unpack = async () => {
              const total = files.length;
              let succeeded = 0;

              for (const _fn of files) {
                const _rp = path.relative(pp, _fn);

                const _to = path.join(dir, _rp);

                const _td = path.resolve(_to, '..');

                const err = await new Promise(_res => {
                  if (!fs.existsSync(_td)) {
                    (0, mkdirp_1.sync)(_td);
                  }

                  fs.rename(_fn, _to, _res);
                });

                if (err) {
                  throw err;
                }

                succeeded += 1;
                updateLog(task, progress_1.ProgressTag.unpack, succeeded / total);
              }

              fs.rmdirSync(pp, {
                recursive: true
              });
            };

            return unpack().then(() => {
              resolve([null, null]);
            });
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

        updateLog(task, progress_1.ProgressTag.unpack, 1);
      }

      updateLog(task, progress_1.ProgressTag.done);
      count.completed.push(`${name}@${mod.version}`);
      onProgress?.(count.completed, count.failed, count.total);
      return {
        name,
        version: mod.version,
        err: null,
        data: {
          size: size,
          unpackedSize: mod.dist.unpackedSize,

          /** where is me, absolute path */
          dir
        },
        _request: {
          url
        }
      };
    };

    return {
      task: async (ctx, task) => {
        const res = await run(ctx, task);
        onEnd?.(res);
        return;
      }
    };
  });
  return tasks;
};

exports.default = batchDownload;