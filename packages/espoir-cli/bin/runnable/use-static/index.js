"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:00:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:25:36
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const commander_1 = require("commander");

const _env_1 = require("../../utils/env");

const export_packages_1 = require("./scripts/export-packages");

const validPackages = (_env_1.default.packages ?? []).filter(name => _env_1.default.packageMap?.[name]?.espoirPackage !== 'module');
/**
 * @since 1.1.0
 */

const UseStatic = {
  fullName: 'use-static',
  displayName: 'use-static',
  aliases: ['use', 'static', 'export'],
  description: 'Export the package(s) to the whole monorepo',
  usage: '[option] <packages...>',
  args: [new commander_1.Argument('[packages...]', 'local package(s) to export')],
  options: [],
  exec: async packages => {
    if (packages.length === 0) {
      const msg = 'You have to give at least one package.';
      throw new Error(msg);
    }

    for (const name of packages) {
      if (!validPackages.includes(name)) {
        const msg = `"${name}" is unable to be exported.`;
        throw new Error(msg);
      }
    }

    return await (0, export_packages_1.default)(packages);
  }
};
exports.default = UseStatic;