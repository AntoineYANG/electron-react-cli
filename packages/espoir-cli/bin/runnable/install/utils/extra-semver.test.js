"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-18 21:54:08
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-18 00:08:28
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const globals_1 = require("@jest/globals");

const extra_semver_1 = require("./extra-semver");

(0, globals_1.describe)('install/utils/extra-semver', () => {
  (0, globals_1.test)('coalesceVersions', () => {
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)([])).toEqual([]);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['*'])).toEqual(['*']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['3.2.1'])).toEqual(['3.2.1']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['4.2.1 - 5.4.0'])).toEqual(['>=4.2.1 <=5.4.0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['^4.1.2'])).toEqual(['>=4.1.2 <5.0.0-0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['^0.2.7'])).toEqual(['>=0.2.7 <0.3.0-0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>3.2.10'])).toEqual(['>3.2.10']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>=2.7.1'])).toEqual(['>=2.7.1']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['<1.8.4'])).toEqual(['<1.8.4']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['<=7.5.2'])).toEqual(['<=7.5.2']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['*', '2.5.6'])).toEqual(['2.5.6']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['2.4.3', '3.0.6', '*'])).toEqual(['2.4.3', '3.0.6']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['2.11.0', '2.11.0'])).toEqual(['2.11.0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>2.1.0', '2.6.2'])).toEqual(['2.6.2']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['2.1.0', '^2.6.2'])).toEqual(['2.1.0', '>=2.6.2 <3.0.0-0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>2.1.0', '<=1.0.10'])).toEqual(['>2.1.0', '<=1.0.10']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>2.1.0', '>=2.2.10', '<1.0.10'])).toEqual(['>=2.2.10', '<1.0.10']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>=4.2.1', '<=5.4.0'])).toEqual(['>=4.2.1 <=5.4.0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['>4.2.2', '<5.4.0'])).toEqual(['>4.2.2 <5.4.0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['^5.2.3', '<5.4.0'])).toEqual(['>=5.2.3 <6.0.0-0 <5.4.0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['^1.2.3', '<5.4.0'])).toEqual(['>=1.2.3 <2.0.0-0']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['^0.2.3', '0.3.1'])).toEqual(['>=0.2.3 <0.3.0-0', '0.3.1']);
    (0, globals_1.expect)((0, extra_semver_1.coalesceVersions)(['^2.1.0', '>2.0.0'])).toEqual(['>=2.1.0 <3.0.0-0']);
  });
});