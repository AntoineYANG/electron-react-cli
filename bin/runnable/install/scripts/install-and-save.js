"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-20 22:17:42
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-21 02:46:31
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const __1 = require("../../..");
const __2 = require("../..");
const resolve_deps_1 = require("../utils/resolve-deps");
const lock_1 = require("../utils/lock");
const download_deps_1 = require("../utils/download-deps");
const map_1 = require("../utils/map");
const diff_local_1 = require("../utils/diff-local");
const parse_dependencies_1 = require("../utils/parse-dependencies");
/**
 * Install modules and save as package dependencies.
 *
 * @param {string[]} modules
 * @param {string[]} scopes
 * @param {('dependencies' | 'devDependencies')} tag
 * @returns {Promise<ExitCode>}
 */
const installAndSave = async (modules, scopes, tag) => {
    const tasks = (0, __2.TaskManagerFactory)();
    tasks.add([{
            title: 'Viewing dependencies.',
            task: async (ctx, task) => {
                // parse
                task.output = 'Parsing dependencies';
                ctx.dependencies = (0, parse_dependencies_1.default)(modules);
                ctx.lockData = (0, lock_1.useLockFileData)();
                // resolve
                task.output = 'Resolving dependencies';
                const printProgress = (resolved, unresolved) => {
                    task.output = chalk ` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
                };
                ctx.resolvedDeps = await (0, resolve_deps_1.resolvePackageDeps)(ctx.dependencies.map(dep => ({
                    name: dep.name,
                    versions: [dep.version]
                })), ctx.lockData, printProgress);
                task.output = 'Successfully resolved declared dependencies';
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
                        clearOutput: true,
                        collapse: true
                    }
                });
            }
        }, {
            title: 'Linking.',
            task: async (ctx, task) => {
                task.output = 'Linking /node_modules/';
                console.log(ctx.installResults.map(d => `${d.name}@${d.version}`));
                process.exit(-1);
                await (0, map_1.default)(ctx.dependencies.map(dep => ({
                    name: dep.name,
                    versions: [dep.version]
                })), ctx.lockData, ctx.installResults);
                task.output = 'Linked successfully';
            }
        }, {
            title: '?',
            task: (ctx, task) => {
                const failed = ctx.installResults.filter(d => d.err);
                failed.forEach(f => {
                    console.log(f.name, f.version);
                    console.error(f.err);
                });
                console.log(ctx.installResults.length, failed.length);
                process.exit(-1);
            }
        }], {
        exitOnError: true,
        concurrent: false
    });
    // tasks.add([, {
    //   title: 'Saving lock file.',
    //   task: (ctx, task) => {
    //     task.output = 'Saving espoir lock file';
    //     writeLockFile(ctx.lockData);
    //     task.output = 'Espoir lock file saved';
    //   }
    // }], {
    //   exitOnError: true,
    //   concurrent: false
    // });
    const _ctx = await tasks.runAll();
    return __1.ExitCode.OK;
};
exports.default = installAndSave;
