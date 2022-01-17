"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:15:40
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:52:34
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const lock_1 = require("../../utils/lock");

const diff_local_1 = require("../../utils/diff-local");

const diffLocalFiles = () => ({
  title: 'Diffing local files.',
  task: async (ctx, task) => {
    task.output = 'Checking installed modules';
    ctx.diff = await (0, diff_local_1.default)(ctx.resolvedDeps);
    ctx.lockData = (0, lock_1.createLockData)(ctx.lockData, ctx.diff);
    task.output = 'Diffing succeeded';
  }
});

exports.default = diffLocalFiles;