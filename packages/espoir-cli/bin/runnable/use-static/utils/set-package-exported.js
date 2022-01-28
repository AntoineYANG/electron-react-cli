"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-28 16:58:46
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:15:16
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const _env_1 = require("../../../utils/env");

const setPackageExported = name => {
  const fn = _env_1.default.resolvePathInPackage(name, 'package.json');

  const data = _env_1.default.packageMap?.[name];
  data.espoirPackage = 'module';
  fs.writeFileSync(fn, JSON.stringify({ ...data,
    espoirPackage: 'module'
  }, undefined, 2) + '\n', {
    encoding: 'utf-8'
  });
};

exports.default = setPackageExported;