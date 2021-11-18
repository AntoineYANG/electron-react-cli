"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-18 13:09:14
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-19 00:46:39
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coalesceVersions = exports.coalesce = void 0;
var semver = require("semver");
var coalesce = function (prev, entering) {
    if (semver.intersects(prev, entering)) {
        if (semver.subset(prev, entering)) {
            return prev;
        }
        if (semver.subset(entering, prev)) {
            return entering;
        }
        return semver.validRange("".concat(prev, " ").concat(entering));
    }
    return null;
};
exports.coalesce = coalesce;
/**
 * Gets the minimum incompatible set of the given ranges.
 */
var coalesceVersions = function (ranges) {
    if (ranges.length < 2) {
        return ranges.map(function (d) { return semver.validRange(d); });
    }
    var fullSet = __spreadArray([], ranges, true);
    var results = [];
    fullSet.forEach(function (set) {
        for (var i = 0; i < results.length; i += 1) {
            var coalesced = (0, exports.coalesce)(results[i], set);
            if (coalesced) {
                // move the matched one, and insert the coalesced set, then break
                results.splice(i, 1, semver.validRange(coalesced));
                return;
            }
        }
        // no one matches
        results.push(semver.validRange(set));
    });
    return results;
};
exports.coalesceVersions = coalesceVersions;
