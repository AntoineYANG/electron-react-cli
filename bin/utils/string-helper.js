"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 19:03:01
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 19:03:52
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedStrings = void 0;
var sortedStrings = function (data) {
    return data.sort(function (a, b) {
        for (var i = 0; i < a.length && i < b.length; i += 1) {
            var ca = a.charCodeAt(i);
            var cb = b.charCodeAt(i);
            if (ca !== cb) {
                return ca - cb;
            }
        }
        return a.length - b.length;
    });
};
exports.sortedStrings = sortedStrings;
