"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-28 16:46:58
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:03:23
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_1 = require("../../../..");

const _runnable_1 = require("../..");

const export_package_1 = require("./tasks/export-package");
/**
 * Export package(s) to the whole monorepo.
 *
 * @param {string[]} packages
 * @returns {Promise<ExitCode>}
 */


const exportPackages = async packages => {
  const tasks = (0, _runnable_1.TaskManagerFactory)();
  tasks.add(packages.map(name => (0, export_package_1.default)(name)), {
    exitOnError: true,
    concurrent: true
  });

  const _ctx = await tasks.runAll();

  return index_1.ExitCode.OK;
};

exports.default = exportPackages;