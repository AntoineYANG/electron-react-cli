"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-02 18:32:55
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 18:25:34
 */
Object.defineProperty(exports, "__esModule", { value: true });
const get_git_preset_1 = require("@@contribute/utils/get-git-preset");
/**
 * Initialize context with git info.
 *
 * @returns {Promise<GitStatus>}
 */
const gitPreset = async () => {
    const state = await (0, get_git_preset_1.default)();
    return state;
};
exports.default = gitPreset;
