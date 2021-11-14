"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 18:34:47
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:12:47
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.view = void 0;
var env_1 = require("../../utils/env");
var _1 = require(".");
/**
 * Gets information of the package from npm registry.
 *
 * @param {string} name
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, NpmPackage]>)}
 */
var view = function (name, options) {
    return _1.default.get("" + env_1.default.runtime.npm.registry + name, __assign(__assign({ expiresSpan: 1000 * 60 * 60 * 24 * 15 }, options), { memo: false, cache: false }), function (np) {
        var versions = {};
        Object.entries(np.versions).forEach(function (_a) {
            var v = _a[0], d = _a[1];
            versions[v] = {
                name: d.name,
                version: d.version,
                dist: {
                    tarball: d.dist.tarball
                },
                dependencies: d.dependencies
            };
        });
        return {
            name: np.name,
            versions: versions
        };
    });
};
exports.view = view;
