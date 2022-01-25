"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 23:00:21
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:55:23
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const del_dep_1 = require("../utils/del-dep");

const lock_1 = require("../../../install/utils/lock");

const updatePackage = (modules, packages, updateLock) => ({
  title: `Updating package.json${updateLock ? ' and lock file' : ''}.`,
  task: (ctx, task) => {
    task.output = 'Updating package.json';
    packages.forEach(pkg => {
      modules.forEach(mod => {
        (0, del_dep_1.default)(pkg, mod);
      });
    });
    task.output = 'package.json updated';

    if (updateLock) {
      task.output = 'Updating lock file';
      (0, lock_1.writeLockFile)(ctx.lockData);
      task.output = 'Lock file updates';
    }
  }
});

exports.default = updatePackage;