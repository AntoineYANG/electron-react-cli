"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:39:25
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:35:54
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const path = require("path");

const mkdirp_1 = require("mkdirp");

const _env_1 = require("../../../utils/env");

const dir = _env_1.default.rootDir ? _env_1.default.resolvePath('.espoir') : '.espoir';
const fn = path.join(dir, 'failed-to-install.json');

if (!fs.existsSync(dir)) {
  (0, mkdirp_1.sync)(dir);
}
/**
 * Save messages of the modules failed to install.
 *
 * @param {InstallResult[]} installResults results of the installation, allowed to include succeeded ones
 * @returns {(string | null)} if the param includes failure messages, returns the path of the file, otherwise returns null
 */


const saveFailed = installResults => {
  const failedBefore = [];

  if (fs.existsSync(fn)) {
    failedBefore.push(...JSON.parse(fs.readFileSync(fn, {
      encoding: 'utf-8'
    })));
  }

  const failed = installResults.filter(ir => !ir.data);

  if (failed.length === 0) {
    return null;
  }

  fs.writeFileSync(fn, JSON.stringify([...failedBefore, failed]));
  return fn;
};

exports.default = saveFailed;