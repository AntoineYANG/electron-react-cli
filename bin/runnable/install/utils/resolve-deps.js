"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 17:53:51
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 20:58:33
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
exports.resolveDependencies = exports.getMinIncompatibleSet = void 0;
var semver = require("semver");
var request_1 = require("../../../utils/request");
/**
 * Returns available versions of a module.
 * Results is sorted by version in descending order.
 *
 * @param {string} name name of the module
 * @param {string} version semver range
 * @param {boolean} [noCache=false]
 * @returns {Promise<VersionInfo[]>}
 */
var getAvailableVersions = function (name, version, noCache) {
    if (noCache === void 0) { noCache = false; }
    return new Promise(function (resolve, reject) {
        request_1.default.npm.view(name, {
            cache: !noCache
        }).then(function (_a) {
            var err = _a[0], data = _a[1];
            if (err) {
                return reject(err);
            }
            var versions = Object.entries(data.versions).reduce(function (list, _a) {
                var _b;
                var v = _a[0], d = _a[1];
                if (((_b = d.dist) === null || _b === void 0 ? void 0 : _b.tarball) && semver.satisfies(v, version)) {
                    return __spreadArray(__spreadArray([], list, true), [d], false);
                }
                return list;
            }, []).sort((function (a, b) { return (semver.lt(a.version, b.version) ? 1 : -1); }));
            resolve(versions);
        });
    });
};
// /**
//  * 
//  *
//  * @param {string} a
//  * @param {string} b
//  * @returns {(string | null)}
//  */
// const compatibleRange = (a: string, b: string): string | null => {};
// const minCompatibleSet = (versions: string[]): string[] => {
//   const results: string[] = [];
//   return results;
// };
/**
 * Returns the minimum incompatible set of the dependency.
 *
 * @param {Dependency} dependency
 * @param {boolean} [noCache=false]
 * @returns {Promise<MinIncompatibleSet>}
 */
var getMinIncompatibleSet = function (dependency, noCache) {
    if (noCache === void 0) { noCache = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var minSet, satisfied;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    minSet = [];
                    dependency.versions.map(function (v) {
                        return getAvailableVersions(dependency.name, v, noCache);
                    }, []);
                    return [4 /*yield*/, Promise.all(dependency.versions.map(function (v) {
                            return getAvailableVersions(dependency.name, v, noCache);
                        }, []))];
                case 1:
                    satisfied = (_a.sent());
                    // FIXME:
                    satisfied.forEach(function (sl) {
                        minSet.push({
                            name: sl[0].name,
                            version: sl[0].version
                        });
                    });
                    return [2 /*return*/, minSet];
            }
        });
    });
};
exports.getMinIncompatibleSet = getMinIncompatibleSet;
/**
 * Resolves all the implicit dependencies.
 *
 * @param {SingleDependency[]} dependencies
 * @param {VersionInfo[]} [memoized=[]]
 * @param {boolean} [noCache=false]
 * @returns {Promise<VersionInfo[]>}
 */
var resolveDependencies = function (dependencies, memoized, noCache) {
    if (memoized === void 0) { memoized = []; }
    if (noCache === void 0) { noCache = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var data, entering, unresolved, tasks, items, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = __spreadArray([], memoized, true);
                    entering = [];
                    unresolved = [];
                    tasks = dependencies.map(function (dep) { return __awaiter(void 0, void 0, void 0, function () {
                        var isDeclared, satisfied, target;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    isDeclared = function () { return Boolean(data.find(function (d) { return d.name === dep.name && semver.satisfies(d.version, dep.version); })); };
                                    if (isDeclared()) {
                                        // this dependency is already resolved
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, getAvailableVersions(dep.name, dep.version, noCache)];
                                case 1:
                                    satisfied = _a.sent();
                                    if (isDeclared()) {
                                        // this dependency is already resolved when checking
                                        return [2 /*return*/];
                                    }
                                    target = satisfied[0];
                                    // add it to the list
                                    entering.push(target);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(tasks)];
                case 1:
                    _a.sent();
                    if (!entering.length) return [3 /*break*/, 4];
                    data.push.apply(data, entering);
                    // collect the dependencies of the entered items
                    entering.forEach(function (item) {
                        var _a;
                        Object.entries((_a = item.dependencies) !== null && _a !== void 0 ? _a : {}).forEach(function (_a) {
                            var name = _a[0], range = _a[1];
                            var satisfied = data.find(function (d) { return d.name === name && semver.satisfies(d.version, range); });
                            if (!satisfied) {
                                var declared = unresolved.find(function (d) { return d.name === name; });
                                if (declared) {
                                    if (!declared.versions.includes(range)) {
                                        declared.versions.push(range);
                                    }
                                }
                                else {
                                    unresolved.push({
                                        name: name,
                                        versions: [range]
                                    });
                                }
                            }
                        });
                    });
                    return [4 /*yield*/, Promise.all(unresolved.map(function (d) { return (0, exports.getMinIncompatibleSet)(d, noCache); }))];
                case 2:
                    items = (_a.sent()).flat(1);
                    return [4 /*yield*/, (0, exports.resolveDependencies)(items, data, noCache)];
                case 3:
                    results = _a.sent();
                    data.push.apply(data, results);
                    _a.label = 4;
                case 4: return [2 /*return*/, data];
            }
        });
    });
};
exports.resolveDependencies = resolveDependencies;
