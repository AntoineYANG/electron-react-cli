"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-02 18:09:51
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:03:55
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const commit_1 = require("./scripts/commit");

const Contribute = {
  fullName: 'contribute',
  displayName: 'contribute',
  aliases: ['c', 'contr', 'cont', 'commit'],
  description: 'Modify the changes and commit them',
  usage: '',
  args: [],
  options: [],
  exec: async () => {
    return (0, commit_1.default)();
  }
};
exports.default = Contribute;