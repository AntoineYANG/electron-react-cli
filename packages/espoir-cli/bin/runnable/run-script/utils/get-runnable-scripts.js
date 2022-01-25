"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-30 19:15:56
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:22:44
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const path = require("path");

const _env_1 = require("../../../utils/env");

const physicalScriptDirs = ['scripts', 'tasks'];
const physicalScriptLoader = {
  js: name => `node ${name}.js`,
  bat: name => `${name}.bat`,
  sh: name => `${name}.sh`,
  exe: name => `${name}.exe`,
  '': name => name
};

const getPhysicalScripts = (scope, defined) => {
  const res = [];
  const dir = scope === 'root' ? _env_1.default.rootDir : _env_1.default.resolvePathInPackage(scope);
  physicalScriptDirs.forEach(d => {
    const __dir = path.join(dir, d);

    if (fs.existsSync(__dir) && fs.statSync(__dir).isDirectory()) {
      fs.readdirSync(__dir).forEach(f => {
        const fn = path.join(__dir, f);

        if (fs.statSync(fn).isFile()) {
          const tmp = f.split('.');
          const name = tmp.slice(0, tmp.length - 1).join('.');
          const scriptName = `${scope}.${name}`;

          if (defined.includes(scriptName)) {
            return;
          }

          const type = tmp.length > 1 ? tmp[tmp.length - 1] : '';
          const loaded = physicalScriptLoader[type];

          if (loaded) {
            res.push({
              name: scriptName,
              cmd: loaded(name),
              cwd: __dir
            });
            defined.push(scriptName);
          }
        }
      });
    }
  });
  return res;
};
/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {RunnableScript[]}
 */


const getRunnableScripts = scope => {
  if (scope) {
    const res = scope === 'root' ? Object.entries(_env_1.default.rootPkg?.scripts ?? {}).map(([n, cmd]) => ({
      name: `root.${n}`,
      cmd,
      cwd: _env_1.default.rootDir
    })) : Object.entries(_env_1.default.packageMap?.[scope].scripts ?? {}).map(([n, cmd]) => ({
      name: `${scope}.${n}`,
      cmd,
      cwd: _env_1.default.resolvePathInPackage(scope)
    }));
    res.push(...getPhysicalScripts(scope, res.map(d => d.name)));
    return res.sort(({
      name: a
    }, {
      name: b
    }) => {
      for (let i = 0; i < a.length && i < b.length; i += 1) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
          return a.charCodeAt(i) - b.charCodeAt(i);
        }
      }

      return a.length - b.length;
    });
  }

  const allScripts = [];
  allScripts.push(...Object.entries(_env_1.default.rootPkg?.scripts ?? {}).map(([n, cmd]) => ({
    name: `root.${n}`,
    cmd,
    cwd: _env_1.default.rootDir
  })));
  allScripts.push(...getPhysicalScripts('root', allScripts.map(d => d.name)));
  _env_1.default.packages?.forEach(p => {
    allScripts.push(...Object.entries(_env_1.default.packageMap?.[p].scripts ?? {}).map(([n, cmd]) => ({
      name: `${p}.${n}`,
      cmd,
      cwd: _env_1.default.resolvePathInPackage(p)
    })));
    allScripts.push(...getPhysicalScripts(p, allScripts.map(d => d.name)));
  });
  return allScripts.sort(({
    name: a
  }, {
    name: b
  }) => {
    for (let i = 0; i < a.length && i < b.length; i += 1) {
      if (a.charCodeAt(i) !== b.charCodeAt(i)) {
        return a.charCodeAt(i) - b.charCodeAt(i);
      }
    }

    return a.length - b.length;
  });
};

exports.default = getRunnableScripts;