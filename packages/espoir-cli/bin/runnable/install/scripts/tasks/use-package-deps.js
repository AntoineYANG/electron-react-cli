"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-02 17:50:59
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:58:43
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const load_dependencies_1 = require("@@install/utils/load-dependencies");
const lock_1 = require("@@install/utils/lock");
const resolve_deps_1 = require("@@install/utils/resolve-deps");
/**
 * Initialize `ctx.dependencies` by resolving dependencies in required packages.
 *
 * @template T
 * @param {string[]} scopes
 * @param {boolean} isProd
 * @returns {ListrTask<T, ListrRendererFactory>}
 */
const usePackageDeps = (scopes, isProd) => ({
    title: 'Loading all the explicit dependencies from all `package.json`.',
    task: async (ctx, task) => {
        // parse
        task.output = 'Resolving `package.json`';
        ctx.dependencies = (0, load_dependencies_1.default)(scopes, isProd);
        task.output = 'Successfully resolved `package.json`';
        ctx.lockData = (0, lock_1.useLockFileData)();
        // resolve
        task.output = 'Resolving dependencies';
        const printProgress = (resolved, unresolved) => {
            task.output = chalk ` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
        };
        ctx.resolvedDeps = await (0, resolve_deps_1.resolvePackageDeps)(ctx.dependencies, ctx.lockData, printProgress);
        task.output = 'Successfully resolved declared dependencies';
    }
});
exports.default = usePackageDeps;
