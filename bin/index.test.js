"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-15 21:01:58
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 22:26:54
 */
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var index_1 = require("./index");
(0, globals_1.describe)('espoir/install', function () {
    (0, globals_1.test)('espoir install', function () {
        (0, globals_1.expect)((0, index_1.default)('install')).resolves.toBe(index_1.ExitCode.OK);
    });
});
