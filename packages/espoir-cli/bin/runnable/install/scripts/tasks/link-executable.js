"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:27:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:53:14
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const link_cli_1 = require("../../utils/link-cli");

const linkExecutable = () => ({
  title: 'Creating links for CLI dependencies.',
  task: (ctx, task) => {
    task.output = 'Creating links';
    ctx.bin = (0, link_cli_1.default)(ctx.dependencies);
    (0, link_cli_1.writeLinks)(ctx.bin);
    task.output = `Created ${ctx.bin.length} links`;
  }
});

exports.default = linkExecutable;