"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-26 16:45:07
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 13:39:53
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const update_1 = require("./scripts/update");
/**
 * @since 1.0.0
 */


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