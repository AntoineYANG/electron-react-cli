"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-15 23:23:40
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 23:32:29
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceRoot = void 0;
var env_1 = require("../env");
exports.WorkspaceRoot = ':';
var validPackagePtn = /^(:|(:(?<name>[\-_a-zA-Z0-9]+)))$/;
/**
 * If the given string match package pattern, returns the name of the package, else returns false.
 *
 * @param {string} arg
 * @returns {(string | null)}
 */
var validatePackage = function (arg) {
    var match = validPackagePtn.exec(arg);
    if (match) {
        var name_1 = match.groups.name;
        if (!name_1) {
            // root
            return exports.WorkspaceRoot;
        }
        else {
            // check if actually exists
            if (env_1.default.packages.includes(name_1)) {
                return name_1;
            }
        }
    }
    return null;
};
exports.default = validatePackage;
