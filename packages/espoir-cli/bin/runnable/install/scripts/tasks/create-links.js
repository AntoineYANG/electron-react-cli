"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:23:22
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:28:37
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const map_1 = require("../../utils/map");

const createLinks = () => ({
  title: 'Linking.',
  task: async (ctx, task) => {
    task.output = 'Linking /node_modules/';
    await (0, map_1.default)(ctx.dependencies, ctx.lockData, ctx.installResults, log => {
      task.output = log;
    });
    task.output = 'Linked successfully';
  }
});

exports.default = createLinks;