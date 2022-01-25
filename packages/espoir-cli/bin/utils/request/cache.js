"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 23:23:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 19:56:42
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoized = exports.memoize = exports.useLocalCache = exports.writeLocalCache = void 0;
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const _env_1 = require("@env");
const cache = [];
const memo = [];
// load local cache
const loadLocalCache = () => {
    const dir = path.join(_env_1.default.configs.cacheDir, '.espoir', '.cache');
    if (!fs.existsSync(dir)) {
        mkdirp(dir);
        return;
    }
    const fn = path.join(dir, 'requests.json');
    fs.readFile(fn, {
        encoding: 'utf-8'
    }, (err, data) => {
        if (err) {
            return;
        }
        const content = JSON.parse(data).filter(d => d.expiresTime >= Date.now());
        content.forEach(d => cache.push(d));
    });
};
loadLocalCache();
const writeLocalCache = (url, resp, expires, filter) => {
    cache.push({
        url,
        resp: filter(resp),
        expiresTime: Date.now() + expires
    });
    fs.writeFileSync(path.join(_env_1.default.configs.cacheDir, '.espoir', '.cache', 'requests.json'), JSON.stringify(cache), {
        encoding: 'utf-8'
    });
};
exports.writeLocalCache = writeLocalCache;
const useLocalCache = (url) => {
    const found = cache.find(d => d.url === url);
    if (found) {
        return found.resp;
    }
    return null;
};
exports.useLocalCache = useLocalCache;
const memoize = (url, resp, filter) => {
    memo.push({
        url,
        resp: filter(resp)
    });
};
exports.memoize = memoize;
const useMemoized = (url) => {
    const found = memo.find(d => d.url === url);
    if (found) {
        return found.resp;
    }
    return null;
};
exports.useMemoized = useMemoized;
