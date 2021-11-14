"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-13 23:44:59
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 22:36:15
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDependencies = void 0;
var logger_1 = require("../../../utils/ui/logger");
var keysNotAllowedInRoot = [
    'dependencies'
];
/**
 * Returns all the explicit dependencies.
 *
 * @param {PackageJSON} pkgJSON
 * @param {DependencyTag[]} keys
 * @returns {Dependency[]}
 */
var getAllDependencies = function (pkgJSON, keys) {
    var isRoot = Boolean(pkgJSON.private);
    var dependencies = [];
    keys.forEach(function (key) {
        var _a;
        if (isRoot && keysNotAllowedInRoot.includes(key) && pkgJSON[key]) {
            logger_1.default.warn("`" + key + "` in root `package.json` is found, which is not suggested. "
                + 'Move them to `devDependencies` or any child package instead. ');
            return;
        }
        Object.entries((_a = pkgJSON[key]) !== null && _a !== void 0 ? _a : {}).forEach(function (_a) {
            var name = _a[0], version = _a[1];
            var declared = dependencies.find(function (d) { return d.name === name; });
            if (declared) {
                // the module is already declared
                if (!declared.versions.includes(version)) {
                    declared.versions.push(version);
                }
            }
            else {
                dependencies.push({
                    name: name,
                    versions: [version]
                });
            }
        });
    });
    return dependencies;
};
exports.getAllDependencies = getAllDependencies;
