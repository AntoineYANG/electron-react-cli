"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-17 23:44:32
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-18 00:53:35
 */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const rm_module_1 = require("./rm-module");
(0, globals_1.describe)('uninstall/scripts/utils/rm-module.ts', () => {
    (0, globals_1.test)('rmModules', () => {
        // nothing's gonna be deleted
        (0, globals_1.expect)((0, rm_module_1.default)({
            foo: {
                '1.2.3': {
                    resolved: '...',
                    target: '...',
                    integrity: '...',
                    requires: {}
                }
            }
        }, [{
                module: {
                    name: 'foo',
                    version: '1.2.3'
                },
                location: '...',
                packages: ['a'],
                required: [],
                requiring: {}
            }], 'a', [{
                name: 'bar',
                version: '*'
            }]).deleted.length).toEqual(0);
        // remove one
        (0, globals_1.expect)((0, rm_module_1.default)({
            foo: {
                '1.2.3': {
                    resolved: '...',
                    target: '...',
                    integrity: '...',
                    requires: {}
                }
            }
        }, [{
                module: {
                    name: 'foo',
                    version: '1.2.3'
                },
                location: '...',
                packages: ['a'],
                required: [],
                requiring: {}
            }], 'a', [{
                name: 'foo',
                version: '*'
            }]).deleted.length).toEqual(1);
        (0, globals_1.expect)((0, rm_module_1.default)({
            foo: {
                '1.2.3': {
                    resolved: '...',
                    target: '...',
                    integrity: '...',
                    requires: {}
                }
            }
        }, [{
                module: {
                    name: 'foo',
                    version: '1.2.3'
                },
                location: '...',
                packages: ['a'],
                required: [],
                requiring: {}
            }], 'a', [{
                name: 'foo',
                version: '*'
            }]).lockData).toEqual({});
    });
});
