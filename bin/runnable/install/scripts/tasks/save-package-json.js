"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:51:29
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 01:22:20
 */
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const save_package_deps_1 = require("../../utils/save-package-deps");
const savePackageJSON = (scopes, tag) => ({
    title: 'Saving package dependencies.',
    task: (ctx, task) => {
        task.output = 'Saving package.json';
        const deps = ctx.dependencies.map(dep => {
            const required = semver.validRange(dep.version);
            const installed = Object.keys(ctx.lockData[dep.name] ?? {})?.[0];
            if (!installed || !semver.satisfies(installed, required)) {
                return null;
            }
            const realRange = `^${installed}`;
            const supposedRange = semver.subset(realRange, required) ? realRange : required;
            return {
                name: dep.name,
                version: supposedRange
            };
        }).filter(Boolean);
        (0, save_package_deps_1.default)(deps, scopes, tag);
        task.output = 'Package dependencies updated';
    }
});
exports.default = savePackageJSON;
