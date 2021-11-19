"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-20 00:00:33
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 01:49:12
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const __1 = require("../../..");
const __2 = require("../..");
const load_dependencies_1 = require("../utils/load-dependencies");
const resolve_deps_1 = require("../utils/resolve-deps");
const lock_1 = require("../utils/lock");
const download_deps_1 = require("../utils/download-deps");
const map_1 = require("../utils/map");
const diff_local_1 = require("../utils/diff-local");
/**
 * Install local dependencies.
 *
 * @param {boolean} isProd
 * @param {string[]} scopes
 * @returns {Promise<ExitCode>}
 */
const installAll = async (isProd, scopes) => {
    const tasks = (0, __2.TaskManagerFactory)();
    tasks.add([{
            title: 'Loading all the explicit dependencies from all `package.json`.',
            task: (ctx, task) => {
                task.output = 'Resolving `package.json`';
                ctx.dependencies = (0, load_dependencies_1.default)(scopes, isProd);
                task.output = 'Successfully resolved `package.json`';
            }
        }, {
            title: 'Resolving declared dependencies.',
            task: async (ctx, task) => {
                task.output = 'Viewing declared dependencies';
                const printProgress = (resolved, unresolved) => {
                    task.output = chalk ` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
                };
                ctx.lockData = (0, lock_1.useLockFileData)();
                const { succeeded, failed } = await (0, resolve_deps_1.resolvePackageDeps)(ctx.dependencies, ctx.lockData, printProgress);
                ctx.resolvedDeps = succeeded;
                ctx.unsatisfiedDeps = failed;
                if (failed.length) {
                    task.output = chalk `Resolved declared dependencies while {red ${failed.length}} dependencies cannot be satisfied`;
                    task.title = chalk `Resolving declared dependencies. {redBright {bold \u2716 } ${failed.length} unsatisfied }`;
                }
                else {
                    task.output = 'Successfully resolved declared dependencies';
                }
            }
        }, {
            title: 'Diffing local files.',
            task: async (ctx, task) => {
                task.output = 'Checking installed modules';
                ctx.diff = await (0, diff_local_1.default)(ctx.resolvedDeps);
                ctx.lockData = (0, lock_1.createLockData)(ctx.lockData, ctx.diff);
                task.output = 'Diffing succeeded';
            }
        }, {
            title: 'Installing resolved modules.',
            task: (ctx, task) => {
                task.output = chalk `🧱 {yellow.bold ${ctx.diff.length} }modules will be installed `;
                const printProgress = (completed, failed, total) => {
                    const pending = total.length - completed.length - failed.length;
                    let output = chalk `🧱 {yellow.bold ${ctx.diff.length} }modules will be installed `;
                    if (pending) {
                        output += chalk ` {yellow ${pending} pending }`;
                    }
                    if (completed.length) {
                        output += chalk ` {green ${completed.length} succeeded }`;
                    }
                    if (failed.length) {
                        output += chalk ` {red ${failed.length} failed }`;
                    }
                    task.output = output;
                };
                ctx.installResults = [];
                const subtasks = (0, download_deps_1.default)(ctx.diff, printProgress, res => ctx.installResults.push(res));
                return task.newListr(subtasks, {
                    concurrent: true,
                    rendererOptions: {
                        collapse: true
                    }
                });
            }
        }, {
            title: 'Linking.',
            task: async (ctx, task) => {
                task.output = 'Linking /node_modules/';
                await (0, map_1.default)(ctx.dependencies, ctx.lockData, ctx.installResults);
                task.output = 'Linked successfully';
            }
        }, {
            title: 'Saving lock file.',
            task: (ctx, task) => {
                task.output = 'Saving espoir lock file';
                (0, lock_1.writeLockFile)(ctx.lockData);
                task.output = 'Espoir lock file saved';
            }
        }], {
        exitOnError: true,
        concurrent: false
    });
    const _ctx = await tasks.runAll();
    return __1.ExitCode.OK;
};
exports.default = installAll;
