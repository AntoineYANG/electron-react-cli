"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 23:02:33
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 23:26:22
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const _env_1 = require("../../../../utils/env");

const delDep = (from, name) => {
  const fn = from === 'root' ? _env_1.default.resolvePath('package.json') : _env_1.default.resolvePathInPackage(from, 'package.json');
  const data = from === 'root' ? _env_1.default.rootPkg : _env_1.default.packageMap[from];
  let write = false;
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(k => {
    if (data[k]) {
      const {
        [name]: _,
        ...deps
      } = data[k] ?? {};
      data[k] = deps;
      write = true;

      if (k === 'peerDependencies') {
        if (data.peerDependenciesMeta) {
          const {
            [name]: _,
            ...meta
          } = data.peerDependenciesMeta;
          data.peerDependenciesMeta = meta;
        }
      }
    }
  });

  if (write) {
    fs.writeFileSync(fn, JSON.stringify(data, undefined, 2) + '\n', {
      encoding: 'utf-8'
    });
  }
};

exports.default = delDep;