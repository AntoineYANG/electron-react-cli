"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 20:00:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:58:55
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

const fs = require("fs");

const child_process = require("child_process");

const mkdirp_1 = require("mkdirp");

const semver = require("semver");

const chalk = require("chalk");

const _env_1 = require("../../../utils/env");

const link = async (at, to) => {
  const dir = path.resolve(at, '..');

  if (process.platform === 'win32') {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(dir)) {
        (0, mkdirp_1.sync)(dir);
      } else if (fs.existsSync(at)) {
        fs.rmSync(at, {
          recursive: true,
          force: true
        });
      }

      try {
        fs.readdirSync(to);
      } catch (error) {
        return reject(error);
      }

      if (fs.existsSync(at)) {
        fs.rmSync(at);
      }

      child_process.exec(`cmd /c mklink /j "${at}" "${to}"`, err => {
        if (err) {
          return reject(err);
        }

        return resolve(at);
      });
    });
  }

  throw new Error(`Creating a link on ${process.platform} is not supported now.`);
};

var Steps;

(function (Steps) {
  Steps[Steps["RESOLVING_PACKAGES"] = 0] = "RESOLVING_PACKAGES";
  Steps[Steps["EXPORTING"] = 1] = "EXPORTING";
})(Steps || (Steps = {}));

const PROGRESS_LEN = 24;

const logMappingProgress = (step, succeeded, total) => {
  const pDone = Math.round(PROGRESS_LEN * succeeded / total);
  const pWait = PROGRESS_LEN - pDone;
  const p = chalk`{bgGreenBright ${' '.repeat(pDone)}}{bgGray ${' '.repeat(pWait)}}`;

  let _v = (succeeded / total * 100).toFixed(2).slice(0, 5);

  if (_v.length < 5) {
    _v = `${' '.repeat(5 - _v.length)}${_v}`;
  }

  const v = chalk.green`${_v}%`;
  const done = step;
  const waiting = 1 - done;
  const stepInfo = chalk` (${done ? chalk`{greenBright ${'\u25c8 '.repeat(done)}}` : ''}{rgb(205,185,100) \u25c8 }${waiting ? chalk`{gray ${'\u25c8 '.repeat(waiting)}}` : ''})`;
  const desc = {
    [Steps.RESOLVING_PACKAGES]: 'Resolving downloaded packages',
    [Steps.EXPORTING]: 'Exporting dependencies'
  }[step];
  return `${desc}  ${p} ${v}${stepInfo}${' '.repeat(16)}`;
};
/**
 * Links installed modules to /node_modules/.
 *
 * @param {SingleDependency[]} explicit names of dependencies explicitly declared
 * @param {LockData} lockData generated lock data
 * @param {InstallResult[]} installResults results of installation
 * @param {(log: string) => void} [logProgress]
 * @returns {Promise<void>}
 */


const map = async (explicit, lockData, installResults, logProgress) => {
  const countResolving = {
    total: 0,
    finished: 0
  }; // assign lock info

  for (const ir of installResults) {
    if (!ir.data) {
      continue;
    }

    countResolving.total += 1;
    const lockInfo = lockData[ir.name]?.[ir.version];

    if (!lockInfo) {
      throw new Error(`Cannot find declaration of "${ir.name}@${ir.version}" in lock data.`);
    }

    const target = ir.data.dir; // assign to LockInfo.target

    lockInfo.target = target;
  } // resolve /node_modules/ directories in each module


  for (const ir of installResults) {
    if (!ir.data) {
      continue;
    }

    const lockInfo = lockData[ir.name]?.[ir.version];

    if (!lockInfo) {
      throw new Error(`Cannot find declaration of "${ir.name}@${ir.version}" in lock data.`);
    }

    const {
      target
    } = lockInfo;
    const curPackage = path.join(target, 'package.json');
    const curDeps = Object.entries(JSON.parse(fs.readFileSync(curPackage, {
      encoding: 'utf-8'
    })).dependencies ?? {});

    if (curDeps.length) {
      const curModulesDir = path.join(target, 'node_modules');
      (0, mkdirp_1.sync)(curModulesDir);

      for (const dep of curDeps) {
        const what = lockData[dep[0]];

        if (!what) {
          throw new Error(`Cannot find "${dep[0]}@${dep[1]}" required by "${ir.name}@${ir.version}". `);
        }

        const version = Object.keys(what).find(v => semver.satisfies(v, dep[1]));

        if (!version) {
          throw new Error(`Cannot find "${dep[0]}@${dep[1]}" required by "${ir.name}@${ir.version}". `);
        }

        const which = what[version];
        const depTarget = which.target;

        if (!depTarget || !fs.existsSync(depTarget)) {
          throw new Error(`Files of "${dep[0]}@${version}" (path='${depTarget}') might be broken. `);
        }

        const entry = path.join(curModulesDir, dep[0]); // assign to LockInfo.entry

        which.entry = entry;
        await link(entry, depTarget);
      }
    }

    countResolving.finished += 1;
    logProgress?.(logMappingProgress(Steps.RESOLVING_PACKAGES, countResolving.finished, countResolving.total));
  }

  const modulesDir = _env_1.default.resolvePath('node_modules');

  if (!fs.existsSync(modulesDir)) {
    (0, mkdirp_1.sync)(modulesDir);
  }

  const countExporting = {
    total: explicit.length,
    finished: 0
  };

  for (const dep of explicit) {
    const what = lockData[dep.name];

    if (!what) {
      throw new Error(`Cannot find required dependency: "${dep.name}@${dep.version}". `);
    }

    const version = Object.keys(what).find(v => semver.satisfies(v, dep.version));

    if (!version) {
      throw new Error(`Cannot find required dependency: "${dep.name}@${dep.version}". `);
    }

    const which = what[version];
    const depTarget = which.target;

    if (!depTarget || !fs.existsSync(depTarget)) {
      throw new Error(`Files of "${dep.name}@${version}" (path='${depTarget}') might be broken. `);
    }

    await link(path.join(modulesDir, dep.name), depTarget);
    countExporting.finished += 1;
    logProgress?.(logMappingProgress(Steps.EXPORTING, countExporting.finished, countExporting.total));
  }

  return;
};

exports.default = map;