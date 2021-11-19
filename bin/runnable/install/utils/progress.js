"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 01:05:00
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 21:40:53
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTag = void 0;
const chalk = require("chalk");
var ProgressTag;
(function (ProgressTag) {
    ProgressTag[ProgressTag["prepare"] = 0] = "prepare";
    ProgressTag[ProgressTag["download"] = 1] = "download";
    ProgressTag[ProgressTag["un-compress"] = 2] = "un-compress";
    ProgressTag[ProgressTag["unpack"] = 3] = "unpack";
    ProgressTag[ProgressTag["done"] = 10] = "done";
    ProgressTag[ProgressTag["failed"] = -1] = "failed";
})(ProgressTag = exports.ProgressTag || (exports.ProgressTag = {}));
const desc = {
    0: chalk.blue.bold `[Preparing]`,
    1: chalk.yellow.bold `[Downloading]`,
    2: chalk.magenta.bold `[Un-compressing]`,
    3: chalk.magentaBright.bold `[Unpacking]`,
    10: chalk.greenBright.bold `[Completed]`,
    [-1]: chalk.red.bold `[Failed]`
};
let tasks = [];
const NAME_LEN = 30;
const STAGE_LEN = 14;
/**
 * Updates progress of a task.
 *
 * @param {string} name the installing package
 * @param {ProgressTag} task label of the stage
 * @param {number} p progress of this stage, (0, 1) or -1 if the rate is meaningless
 * @returns {Promise<void>}
 */
const setProgress = async (name, task, p) => {
    const idx = tasks.map(t => t[0]).indexOf(name);
    if (idx === -1 && ![ProgressTag.done, ProgressTag.failed].includes(task)) {
        tasks.push([name, task, p]);
    }
    else if (tasks[idx]) {
        const item = tasks[idx];
        item[1] = task;
        item[2] = p;
    }
};
const stringify = (name, tag, value) => {
    const _name = name.slice(0, NAME_LEN);
    const leftSpan = ' '.repeat(NAME_LEN - _name.length + 2);
    const stage = desc[tag].slice(0, STAGE_LEN) + 2;
    const rightSpan = ' '.repeat(STAGE_LEN - stage.length + 2);
    const p = (value && value >= 0 && value <= 1 && ![ProgressTag.done, ProgressTag.failed].includes(tag)) ? chalk.green `${(value * 100).toFixed(2)}% ` : '';
    return (`${leftSpan}${chalk.green.bold(_name + ' ')}${desc[tag]}${rightSpan} ${p}${' '.repeat(10)}`);
};
const progress = {
    set: setProgress,
    stringify
};
exports.default = progress;
