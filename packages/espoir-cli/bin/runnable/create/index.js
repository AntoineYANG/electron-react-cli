"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 19:04:52
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:47:40
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const new_monorepo_1 = require("./scripts/new-monorepo");

const new_package_1 = require("./scripts/new-package");

const _env_1 = require("../../utils/env");

const Create = {
  fullName: 'create',
  displayName: _env_1.default.rootDir ? 'new package' : 'new monorepo',
  aliases: ['new'],
  description: _env_1.default.rootDir ? 'Create new package in this monorepo' : 'Create new espoir monorepo',
  usage: '',
  args: [],
  options: [],
  exec: async () => {
    if (_env_1.default.rootDir) {
      return (0, new_package_1.default)();
    } else {
      return (0, new_monorepo_1.default)();
    }
  }
};
exports.default = Create;