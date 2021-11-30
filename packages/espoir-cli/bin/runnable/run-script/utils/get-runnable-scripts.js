"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-30 19:15:56
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-30 19:32:42
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const _env_1 = require("../../../utils/env");
/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {string[]}
 */


const getRunnableScripts = scope => {
  if (scope) {
    const res = scope === 'root' ? Object.keys(_env_1.default.rootPkg.scripts ?? {}).map(n => `root.${n}`) : Object.keys(_env_1.default.packageMap[scope].scripts ?? {}).map(n => `${scope}.${n}`);
    return res.sort((a, b) => {
      for (let i = 0; i < a.length && i < b.length; i += 1) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
          return a.charCodeAt(i) - b.charCodeAt(i);
        }
      }

      return a.length - b.length;
    });
  }

  const allScripts = [];
  allScripts.push(...Object.keys(_env_1.default.rootPkg.scripts ?? {}).map(n => `root.${n}`));

  _env_1.default.packages.forEach(p => {
    allScripts.push(...Object.keys(_env_1.default.packageMap[p].scripts ?? {}).map(n => `${p}.${n}`));
  });

  return allScripts.sort((a, b) => {
    for (let i = 0; i < a.length && i < b.length; i += 1) {
      if (a.charCodeAt(i) !== b.charCodeAt(i)) {
        return a.charCodeAt(i) - b.charCodeAt(i);
      }
    }

    return a.length - b.length;
  });
};

exports.default = getRunnableScripts;