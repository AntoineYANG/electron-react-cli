"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 00:03:04
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-17 22:30:23
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirAll = void 0;
var path = require("path");
var fs = require("fs");
var semver = require("semver");
var compressing = require("compressing");
var mkdirp_1 = require("mkdirp");
var env_1 = require("../../../utils/env");
var request_1 = require("../../../utils/request");
var progress_1 = require("./progress");
var readDirAll = function (dir) {
    var files = [];
    fs.readdirSync(dir).forEach(function (fn) {
        var p = path.join(dir, fn);
        if (fs.statSync(p).isDirectory()) {
            files.push.apply(files, (0, exports.readDirAll)(p));
        }
        else {
            files.push(p);
        }
    });
    return files;
};
exports.readDirAll = readDirAll;
var MAX_ROWS = 6;
var batchDownload = function (modules, onProgress, onEnd) {
    var count = {
        completed: [],
        failed: [],
        total: modules.map(function (d) { return "".concat(d.name, "@").concat(d.version); })
    };
    var state = modules.map(function (_) { return progress_1.ProgressTag.prepare; });
    var canDisplay = function (idx) {
        if ([progress_1.ProgressTag.done, progress_1.ProgressTag.failed].includes(state[idx])) {
            return false;
        }
        var nowDisplaying = 0;
        for (var i = 0; i <= idx && i < state.length && nowDisplaying < MAX_ROWS; i += 1) {
            if (![progress_1.ProgressTag.done, progress_1.ProgressTag.failed].includes(state[i])) {
                nowDisplaying += 1;
            }
            if (nowDisplaying < MAX_ROWS && i === idx) {
                return true;
            }
        }
        return false;
    };
    var tasks = modules.map(function (mod, i) {
        var name = mod.name, version = mod.version;
        var dir = path.join(env_1.default.resolvePath('.espoir', '.modules'), name, semver.valid(semver.coerce(version)).replace(/\./g, '_'));
        var url = mod.dist.tarball;
        var fn = url.split(/\/+/).reverse()[0];
        var p = path.join(dir, fn);
        var updateLog = function (task, tag, value) {
            state[i] = tag;
            progress_1.default.set(name, tag, value !== null && value !== void 0 ? value : -1);
            if (canDisplay(i)) {
                task.output = progress_1.default.stringify(name, tag, value);
            }
        };
        var run = function (_ctx, task) { return __awaiter(void 0, void 0, void 0, function () {
            var reportFailed, _a, downloadErr, size, error_1, pp, unPackErr;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reportFailed = function (err) {
                            updateLog(task, progress_1.ProgressTag.failed);
                            count.failed.push("".concat(name, "@").concat(version));
                        };
                        updateLog(task, progress_1.ProgressTag.prepare);
                        return [4 /*yield*/, request_1.default.download(url, p, {}, function (done, total) {
                                updateLog(task, progress_1.ProgressTag.download, total ? done / total : 0);
                            })];
                    case 1:
                        _a = _b.sent(), downloadErr = _a[0], size = _a[1];
                        if (downloadErr) {
                            reportFailed(downloadErr);
                            return [2 /*return*/, {
                                    name: name,
                                    version: version,
                                    err: downloadErr,
                                    _request: {
                                        url: url
                                    }
                                }];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        updateLog(task, progress_1.ProgressTag['un-compress'], 0);
                        return [4 /*yield*/, compressing.tgz.uncompress(p, dir)];
                    case 3:
                        _b.sent();
                        fs.rmSync(p);
                        updateLog(task, progress_1.ProgressTag['un-compress'], 1);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        reportFailed(error_1);
                        return [2 /*return*/, {
                                name: name,
                                version: version,
                                err: error_1,
                                _request: {
                                    url: url
                                }
                            }];
                    case 5:
                        pp = path.join(dir, 'package');
                        if (!fs.existsSync(pp)) return [3 /*break*/, 7];
                        // some packages such as type declarations do not have a `/package` directory
                        updateLog(task, progress_1.ProgressTag.unpack, 0);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                try {
                                    var files = (0, exports.readDirAll)(pp);
                                    files.forEach(function (_fn) {
                                        var _rp = path.relative(pp, _fn);
                                        var _to = path.join(dir, _rp);
                                        var _td = path.resolve(_to, '..');
                                        if (!fs.existsSync(_td)) {
                                            (0, mkdirp_1.sync)(_td);
                                        }
                                        fs.renameSync(_fn, _to);
                                    });
                                    fs.rmdirSync(pp, {
                                        recursive: true
                                    });
                                    return resolve([null, null]);
                                }
                                catch (error) {
                                    return resolve([error, null]);
                                }
                            })];
                    case 6:
                        unPackErr = (_b.sent())[0];
                        if (unPackErr) {
                            reportFailed(unPackErr);
                            return [2 /*return*/, {
                                    name: name,
                                    version: version,
                                    err: unPackErr,
                                    _request: {
                                        url: url
                                    }
                                }];
                        }
                        updateLog(task, progress_1.ProgressTag.unpack, 1);
                        _b.label = 7;
                    case 7:
                        updateLog(task, progress_1.ProgressTag.done); // FIXME: not here
                        count.completed.push("".concat(name, "@").concat(mod.version));
                        onProgress === null || onProgress === void 0 ? void 0 : onProgress(count.completed, count.failed, count.total);
                        return [2 /*return*/, {
                                name: name,
                                version: mod.version,
                                err: null,
                                data: {
                                    size: size,
                                    unpackedSize: mod.dist.unpackedSize,
                                    /** where is me, absolute path */
                                    dir: dir
                                },
                                _request: {
                                    url: url
                                }
                            }];
                }
            });
        }); };
        return {
            task: function (ctx, task) { return __awaiter(void 0, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, run(ctx, task)];
                        case 1:
                            res = _a.sent();
                            onEnd === null || onEnd === void 0 ? void 0 : onEnd(res);
                            return [2 /*return*/];
                    }
                });
            }); }
        };
    });
    return tasks;
};
exports.default = batchDownload;
