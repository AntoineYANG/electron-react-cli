"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-06 18:24:18
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-11 19:27:16
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inquirer = require("inquirer");
const logger_1 = require("@ui/logger");
/**
 * Pushes committed version to remote repository.
 *
 * @returns {Promise<string>}
 */
const pushRemote = async (state) => {
    logger_1.default.info('Preparing to write CHANGELOG file. ');
    const doPush = (await inquirer.prompt([{
            type: 'confirm',
            name: 'doPush',
            message: `Push this commit to remote branch origin/${state.curBranch}?`,
            default: true
        }]))['doPush'];
    if (doPush) {
        return (0, child_process_1.execSync)(`git push origin ${state.curBranch}`, {
            encoding: 'utf-8'
        });
    }
    return '';
};
exports.default = pushRemote;
