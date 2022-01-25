"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-22 00:54:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:15:05
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _env_1 = require("@env");
const savePackageDeps = (deps, scopes, tag) => {
    scopes.forEach(scope => {
        const fn = scope === 'root' ? _env_1.default.resolvePath('package.json') : (_env_1.default.resolvePathInPackage(scope, 'package.json'));
        if (!fs.existsSync(fn)) {
            throw new Error(`Cannot find package.json for ${scope === 'root' ? 'workspace root' : `package ${scope}`}. `);
        }
        const data = JSON.parse(fs.readFileSync(fn, {
            encoding: 'utf-8'
        }));
        const { dependencies, devDependencies } = data;
        deps.forEach(dep => {
            if (dependencies?.[dep.name]) {
                dependencies[dep.name] = undefined;
            }
            if (devDependencies?.[dep.name]) {
                devDependencies[dep.name] = undefined;
            }
            const result = {};
            [
                ...Object.entries(data[tag] ?? {}),
                [dep.name, dep.version]
            ].sort((a, b) => {
                const an = a[0];
                const bn = b[0];
                for (let i = 0; i < an.length && i < bn.length; i += 1) {
                    const ac = an.charCodeAt(i);
                    const bc = bn.charCodeAt(i);
                    if (ac !== bc) {
                        return ac - bc;
                    }
                }
                return an.length - bn.length;
            }).forEach(([k, v]) => {
                result[k] = v;
            });
            data[tag] = result;
        });
        fs.writeFileSync(fn, JSON.stringify(data, undefined, 2) + '\n');
    });
};
exports.default = savePackageDeps;
