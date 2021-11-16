"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 20:00:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 23:36:00
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
var path = require("path");
var fs = require("fs");
var child_process = require("child_process");
var mkdirp_1 = require("mkdirp");
var semver = require("semver");
var env_1 = require("../../../utils/env");
var link = function (at, to) { return __awaiter(void 0, void 0, void 0, function () {
    var dir;
    return __generator(this, function (_a) {
        dir = path.resolve(at, '..');
        if (process.platform === 'win32') {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!fs.existsSync(dir)) {
                        (0, mkdirp_1.sync)(dir);
                    }
                    else if (fs.existsSync(at)) {
                        fs.rmSync(at, {
                            recursive: true,
                            force: true
                        });
                    }
                    child_process.exec("mklink /j \"" + at + "\" \"" + to + "\"", function (err) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(at);
                    });
                })];
        }
        return [2 /*return*/, Promise.reject(new Error("Cannot create links on " + process.platform))];
    });
}); };
/**
 * Links installed modules to /node_modules/.
 *
 * @param {string[]} explicit names of dependencies explicitly declared
 * @param {LockData} lockData generated lock data
 * @param {InstallResult[]} installResults results of installation
 */
var map = function (explicit, lockData, installResults) { return __awaiter(void 0, void 0, void 0, function () {
    var modulesDir, outer, whereIs, linking, deps, linking2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                modulesDir = env_1.default.resolvePath('node_modules_');
                outer = __spreadArray([], explicit, true);
                whereIs = function (name) {
                    var decl = outer.findIndex(function (d) { return d.name === name; });
                    if (decl !== -1) {
                        // Note that according to the order of the resolved dependencies,
                        // The modules declared in `package.json` / CLI must be in front of the others.
                        outer.splice(decl);
                        return path.join(modulesDir, name);
                    }
                    return null;
                };
                linking = [];
                Object.entries(lockData).forEach(function (_a) {
                    var name = _a[0], versions = _a[1];
                    Object.entries(versions).forEach(function (_a) {
                        var _b, _c;
                        var v = _a[0], d = _a[1];
                        var p = whereIs(name);
                        var t = installResults.find(function (r) {
                            return r.data && r.name === name && semver.satisfies(r.version, v);
                        });
                        d.target = (_c = (_b = t === null || t === void 0 ? void 0 : t.data) === null || _b === void 0 ? void 0 : _b.dir) !== null && _c !== void 0 ? _c : '';
                        if (!p) {
                            d.path = d.target;
                            return;
                        }
                        d.path = p;
                        linking.push(link(d.path, d.target));
                    });
                });
                return [4 /*yield*/, Promise.all(linking)];
            case 1:
                deps = _a.sent();
                linking2 = [];
                deps.forEach(function (dep) {
                    var fn = path.join(dep, 'package.json');
                    if (fs.existsSync(fn)) {
                        var _a = JSON.parse(fs.readFileSync(fn, { encoding: 'utf-8' })).dependencies, dependencies = _a === void 0 ? null : _a;
                        if (dependencies) {
                            var _dir_1 = path.join(dep, 'node_modules');
                            if (fs.existsSync(_dir_1)) {
                                fs.rmSync(_dir_1, {
                                    recursive: true,
                                    force: true
                                });
                            }
                            (0, mkdirp_1.sync)(_dir_1);
                            Object.entries(dependencies).forEach(function (_a) {
                                var k = _a[0], v = _a[1];
                                var what = lockData[k];
                                var which = what[Object.entries(what).find(function (_a) {
                                    var vi = _a[0];
                                    return semver.satisfies(vi, v);
                                })[0]];
                                var _p = path.join(_dir_1, k);
                                linking2.push(link(_p, which.target));
                            });
                        }
                    }
                });
                return [4 /*yield*/, Promise.all(linking2)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.default = map;
