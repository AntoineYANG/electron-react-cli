"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:27:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:17:47
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const lock_1 = require("../../utils/lock");

const saveLockFile = () => ({
  title: 'Saving lock file.',
  task: (ctx, task) => {
    task.output = 'Saving espoir lock file';
    (0, lock_1.writeLockFile)(ctx.lockData);
    task.output = 'Espoir lock file saved';
  }
});

exports.default = saveLockFile;