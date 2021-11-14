"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 23:23:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:33:00
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoized = exports.memoize = exports.useLocalCache = exports.writeLocalCache = void 0;
var path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");
var env_1 = require("../../utils/env");
var cache = [];
var memo = [];
// load local cache
var loadLocalCache = function () {
    var dir = path.join(env_1.default.configs.cacheDir, '.espoir', '.cache');
    if (!fs.existsSync(dir)) {
        mkdirp(dir);
        return;
    }
    var fn = path.join(dir, 'requests.json');
    fs.readFile(fn, {
        encoding: 'utf-8'
    }, function (err, data) {
        if (err) {
            return;
        }
        var content = JSON.parse(data).filter(function (d) { return d.expiresTime >= Date.now(); });
        content.forEach(function (d) { return cache.push(d); });
    });
};
loadLocalCache();
var writeLocalCache = function (url, resp, expires, filter) {
    cache.push({
        url: url,
        resp: filter(resp),
        expiresTime: Date.now() + expires
    });
    fs.writeFileSync(path.join(env_1.default.configs.cacheDir, '.espoir', '.cache', 'requests.json'), JSON.stringify(cache), {
        encoding: 'utf-8'
    });
};
exports.writeLocalCache = writeLocalCache;
var useLocalCache = function (url) {
    var found = cache.find(function (d) { return d.url === url; });
    if (found) {
        return found.resp;
    }
    return null;
};
exports.useLocalCache = useLocalCache;
var memoize = function (url, resp, filter) {
    memo.push({
        url: url,
        resp: filter(resp)
    });
};
exports.memoize = memoize;
var useMemoized = function (url) {
    var found = memo.find(function (d) { return d.url === url; });
    if (found) {
        return found.resp;
    }
    return null;
};
exports.useMemoized = useMemoized;
