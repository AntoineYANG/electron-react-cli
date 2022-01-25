"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-13 23:44:59
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:24:26
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDependencies = void 0;
const logger_1 = require("@ui/logger");
const _env_1 = require("@env");
const keysNotAllowedInRoot = [
    'dependencies'
];
/**
 * Returns all the explicit dependencies.
 *
 * @param {PackageJSON} pkgJSON
 * @param {DependencyTag[]} keys
 * @returns {Dependency[]}
 */
const getAllDependencies = (pkgJSON, keys) => {
    const isRoot = Boolean(pkgJSON.private);
    const dependencies = [];
    keys.forEach(key => {
        if (isRoot && keysNotAllowedInRoot.includes(key) && pkgJSON[key]) {
            logger_1.default.warn(`\`${key}\` in root \`package.json\` is found, which is not suggested. `
                + 'Move them to `devDependencies` or any child package instead. ');
            return;
        }
        Object.entries(pkgJSON[key] ?? {}).forEach(([name, version]) => {
            const declared = dependencies.find(d => d.name === name);
            if (declared) {
                // the module is already declared
                if (!declared.versions.includes(version)) {
                    declared.versions.push(version);
                }
            }
            else {
                dependencies.push({
                    name,
                    versions: [version]
                });
            }
        });
    });
    return dependencies;
};
exports.getAllDependencies = getAllDependencies;
/**
 * Loads all the explicit dependencies from all `package.json`.
 */
const loadDependencies = (scopes, isProd) => {
    if (!_env_1.default.rootPkg || !_env_1.default.packages || !_env_1.default.packageMap) {
        throw new Error(`You're outside a espoir workspace.`);
    }
    const packages = [];
    if (scopes.includes('root')) {
        packages.push(_env_1.default.rootPkg);
    }
    _env_1.default.packages.forEach(p => {
        const pkg = _env_1.default.packageMap?.[p];
        if (scopes.includes(p)) {
            packages.push(pkg);
        }
    });
    const keys = [
        'dependencies',
        'peerDependencies',
        isProd ? null : 'devDependencies'
    ].filter(Boolean);
    const dependencies = packages.reduce((list, pkgJSON) => {
        const data = (0, exports.getAllDependencies)(pkgJSON, keys);
        return list.concat(data);
    }, []);
    return dependencies.map(d => {
        if (d.versions.length !== 1) {
            throw new Error(`Incompatible required versions found for "${d.name}": [${d.versions.map(v => `'${v}'`).join(', ')}]. `);
        }
        return {
            name: d.name,
            version: d.versions[0]
        };
    });
    ;
};
exports.default = loadDependencies;
