"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:07:04
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:31:18
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chalk = require("chalk");

const parse_dependencies_1 = require("../../utils/parse-dependencies");

const lock_1 = require("../../utils/lock");

const resolve_deps_1 = require("../../utils/resolve-deps");
/**
 * This action will parse an array of strings as dependencies and resolve their dependencies.
 * `Context.dependencies`, `Context.lockData` and `Context.resolvedDeps` will be assigned.
 *
 * @template T context type
 * @param {string[]} modules
 * @returns {ListrTask<T, typeof DefaultRenderer>}
 */


const viewDepsFromArgs = modules => ({
  title: 'Viewing dependencies.',
  task: async (ctx, task) => {
    // parse
    task.output = 'Parsing dependencies';
    ctx.dependencies = (0, parse_dependencies_1.default)(modules);
    ctx.lockData = (0, lock_1.useLockFileData)(); // resolve

    task.output = 'Resolving dependencies';

    const printProgress = (resolved, unresolved) => {
      task.output = chalk` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
    };

    ctx.resolvedDeps = await (0, resolve_deps_1.resolvePackageDeps)(ctx.dependencies, ctx.lockData, printProgress);
    task.output = 'Successfully resolved declared dependencies';
  }
});

exports.default = viewDepsFromArgs;