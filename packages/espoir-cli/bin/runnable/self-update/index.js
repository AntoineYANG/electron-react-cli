"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-26 16:45:07
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:48:25
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const update_1 = require("./scripts/update");

const SelfUpdate = {
  fullName: 'update',
  displayName: 'update',
  aliases: [],
  description: 'Update espoir-cli',
  usage: '',
  args: [],
  options: [],
  exec: async () => {
    return (0, update_1.default)();
  }
};
exports.default = SelfUpdate;