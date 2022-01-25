"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:07:04
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:58:36
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const download_deps_1 = require("@@install/utils/download-deps");
const installResolvedDeps = () => ({
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
});
exports.default = installResolvedDeps;
