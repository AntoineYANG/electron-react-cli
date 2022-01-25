"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 21:27:16
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 23:43:04
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const lock_1 = require("../../../install/utils/lock");

const analyse_requirements_1 = require("../utils/analyse-requirements");

const rm_module_1 = require("../utils/rm-module");

const removeModules = (modules, packages) => ({
  title: 'Removing modules.',
  task: (ctx, task) => {
    ctx.lockData = (0, lock_1.useLockFileData)();
    ctx.requirements = (0, analyse_requirements_1.default)(ctx.lockData);
    let deleted = [];
    const subtasks = packages.map(pkg => {
      return {
        task: (_ctx, subtask) => {
          subtask.output = `Removing modules in "${pkg}"`;
          const deps = modules.reduce((list, name) => {
            return list;
          }, []);
          const res = (0, rm_module_1.default)(ctx.lockData, ctx.requirements, pkg, deps);
          deleted.push(...res.deleted);
          ctx.lockData = res.lockData;
          ctx.requirements = res.requirements;
          subtask.output = `Removed ${res.deleted.length} modules in "${pkg}"`;
          return;
        }
      };
    });
    return task.newListr(subtasks, {
      concurrent: false,
      rendererOptions: {
        clearOutput: true,
        collapse: true
      }
    });
  }
});

exports.default = removeModules;