"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:37:32
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:53:38
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const save_failed_1 = require("../../utils/save-failed");

const saveFailMsg = () => ({
  title: 'Saving messages of failed tasks.',
  skip: ctx => Boolean(ctx.installResults.find(ir => !ir.data)),
  task: (ctx, task) => {
    task.output = 'Saving messages';
    (0, save_failed_1.default)(ctx.installResults);
    task.output = 'Saving completed';
  }
});

exports.default = saveFailMsg;