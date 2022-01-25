"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 21:49:46
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:18:26
 */
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const _env_1 = require("@env");
const analyseRequirements = (lockData) => {
    if (!_env_1.default.packages || !_env_1.default.packageMap) {
        throw new Error(`You're outside a espoir workspace.`);
    }
    const res = [];
    Object.entries(lockData).forEach(([name, item]) => {
        Object.entries(item).forEach(([v, info]) => {
            res.push({
                module: {
                    name,
                    version: v
                },
                location: info.target,
                link: info.entry,
                packages: [],
                required: [],
                requiring: info.requires
            });
        });
    });
    // record dependence between modules
    Object.entries(lockData).forEach(([name, item]) => {
        Object.entries(item).forEach(([v, info]) => {
            Object.entries(info.requires).forEach(([_name, _range]) => {
                const which = res.find(({ module: m }) => m.name === _name && semver.satisfies(m.version, _range));
                which?.required.push(`${name}@${v}`);
            });
        });
    });
    // record dependence between modules and local packages
    _env_1.default.packages.map(pn => _env_1.default.packageMap?.[pn]).forEach((pkg, i) => {
        const name = pkg.name ?? _env_1.default.packages?.[i];
        ['dependencies', 'devDependencies', 'peerDependencies'].forEach(k => {
            const deps = pkg[k] ?? {};
            Object.entries(deps).forEach(([_name, _range]) => {
                const which = res.find(({ module: m }) => m.name === _name && semver.satisfies(m.version, _range));
                which?.packages.push(name);
            });
        });
    });
    return res;
};
exports.default = analyseRequirements;
