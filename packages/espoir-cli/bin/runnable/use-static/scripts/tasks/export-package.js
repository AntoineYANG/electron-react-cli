"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-28 16:50:04
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:28:46
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const set_package_exported_1 = require("../../utils/set-package-exported");

const exportPackage = name => ({
  title: `Export.`,
  task: async (_ctx, task) => {
    task.output = `Exporting ${name}`;
    (0, set_package_exported_1.default)(name);
    task.output = 'Exported successfully';
  }
});

exports.default = exportPackage;