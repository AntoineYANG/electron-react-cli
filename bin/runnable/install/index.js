"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:00:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 20:44:39
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var chalk = require("chalk");
var __1 = require("../..");
var __2 = require("..");
var read_deps_1 = require("./utils/read-deps");
var env_1 = require("../../utils/env");
var resolve_deps_1 = require("./utils/resolve-deps");
var lock_1 = require("./utils/lock");
var logger_1 = require("../../utils/ui/logger");
var validate_package_1 = require("../../utils/workspace/validate-package");
var download_deps_1 = require("./utils/download-deps");
var map_1 = require("./utils/map");
/**
 * Creates an install task.
 *
 * @export
 * @class InstallTask
 * @extends {Runnable}
 */
var InstallTask = /** @class */ (function (_super) {
    __extends(InstallTask, _super);
    function InstallTask(args) {
        return _super.call(this, args, InstallTask.rules) || this;
    }
    InstallTask.prototype.exec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules, scopes, _i, _a, p, scope;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        modules = [];
                        scopes = [];
                        for (_i = 0, _a = this.params; _i < _a.length; _i++) {
                            p = _a[_i];
                            if (p.startsWith(':')) {
                                scope = (0, validate_package_1.default)(p);
                                if (scope) {
                                    scopes.push(scope);
                                }
                                else {
                                    logger_1.default.error(chalk(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{redBright {bold \u2716 } \"{blue.bold ", "}\" is not an existing package.}"], ["{redBright {bold \\u2716 } \"{blue.bold ", "}\" is not an existing package.}"])), p));
                                    return [2 /*return*/, __1.ExitCode.BAD_PARAMS];
                                }
                            }
                            else {
                                modules.push(p);
                            }
                        }
                        if (!(modules.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.installAll(scopes.length ? scopes : 'all')];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.installAndSave(scopes.length ? scopes : 'all', modules)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, __1.ExitCode.OPERATION_NOT_FOUND];
                }
            });
        });
    };
    /**
     * Install local dependencies.
     *
     * @private
     * @param {(string[] | 'all')} [scopes='all']
     * @memberof InstallTask
     */
    InstallTask.prototype.installAll = function (scopes) {
        if (scopes === void 0) { scopes = 'all'; }
        return __awaiter(this, void 0, void 0, function () {
            var NAME, sw, tasks, ctx;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        NAME = 'Install local dependencies';
                        sw = logger_1.default.startStopWatch(NAME);
                        tasks = (0, __2.TaskManagerFactory)();
                        tasks.add([{
                                title: 'Loading all the explicit dependencies from all `package.json`.',
                                task: function (ctx, task) {
                                    task.output = 'Resolving `package.json`';
                                    ctx.dependencies = _this.loadDependencies(scopes);
                                    task.output = 'Successfully resolved `package.json`';
                                }
                            }, {
                                title: 'Resolving declared dependencies.',
                                task: function (ctx, task) { return __awaiter(_this, void 0, void 0, function () {
                                    var printProgress, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                task.output = 'Viewing declared dependencies';
                                                printProgress = function (resolved, unresolved) {
                                                    task.output = chalk(templateObject_2 || (templateObject_2 = __makeTemplateObject([" \u23F3  {green ", " }dependencies resolved, {yellow ", " }left"], [" \\u23f3  {green ", " }dependencies resolved, {yellow ", " }left"])), resolved, unresolved);
                                                };
                                                _a = ctx;
                                                return [4 /*yield*/, this.resolveDependencies(ctx.dependencies, printProgress)];
                                            case 1:
                                                _a.resolvedDeps = _b.sent();
                                                ctx.lockData = (0, lock_1.createLockData)(ctx.resolvedDeps);
                                                task.output = 'Successfully resolved declared dependencies';
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }
                            }, {
                                title: 'Diffing local files.',
                                task: function (ctx, task) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                task.output = 'Checking installed modules';
                                                _a = ctx;
                                                return [4 /*yield*/, this.diffLocal(ctx.resolvedDeps)];
                                            case 1:
                                                _a.diff = _b.sent();
                                                task.output = 'Diffing succeeded';
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }
                            }, {
                                title: 'Installing resolved modules.',
                                task: function (ctx, task) {
                                    task.output = chalk(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\uD83E\uDDF1 {yellow.bold ", " }modules will be installed "], ["\uD83E\uDDF1 {yellow.bold ", " }modules will be installed "])), ctx.diff.length);
                                    var printProgress = function (completed, failed, total) {
                                        var pending = total.length - completed.length - failed.length;
                                        var output = chalk(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\uD83E\uDDF1 {yellow.bold ", " }modules will be installed "], ["\uD83E\uDDF1 {yellow.bold ", " }modules will be installed "])), ctx.diff.length);
                                        if (pending) {
                                            output += chalk(templateObject_5 || (templateObject_5 = __makeTemplateObject([" {yellow ", " pending }"], [" {yellow ", " pending }"])), pending);
                                        }
                                        if (completed.length) {
                                            output += chalk(templateObject_6 || (templateObject_6 = __makeTemplateObject([" {green ", " succeeded }"], [" {green ", " succeeded }"])), completed.length);
                                        }
                                        if (failed.length) {
                                            output += chalk(templateObject_7 || (templateObject_7 = __makeTemplateObject([" {red ", " failed }"], [" {red ", " failed }"])), failed.length);
                                        }
                                        task.output = output;
                                    };
                                    ctx.installResults = [];
                                    var subtasks = _this.createInstallTask(ctx.diff, printProgress, function (res) { return ctx.installResults.push(res); });
                                    return task.newListr(subtasks, {
                                        concurrent: true,
                                        rendererOptions: {
                                            collapse: true
                                        }
                                    });
                                }
                            }, {
                                title: 'Linking.',
                                task: function (ctx, task) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                task.output = 'Linking /node_modules/';
                                                return [4 /*yield*/, (0, map_1.default)(ctx.dependencies, ctx.lockData, ctx.installResults)];
                                            case 1:
                                                _a.sent();
                                                task.output = 'Linked successfully';
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }
                            }, {
                                title: 'Saving lock file.',
                                task: function (ctx, task) {
                                    task.output = 'Saving espoir lock file';
                                    (0, lock_1.writeLockFile)(ctx.lockData);
                                    task.output = 'Espoir lock file saved';
                                }
                            }], {
                            exitOnError: true,
                            concurrent: false
                        });
                        return [4 /*yield*/, tasks.runAll()];
                    case 1:
                        ctx = _a.sent();
                        logger_1.default.stopStopWatch(sw);
                        process.exit(0);
                        throw new Error('Method is not implemented');
                }
            });
        });
    };
    /**
     * Install new dependencies, and add them to `package.json`.
     *
     * @private
     * @param {(string[] | 'all')} scopes
     * @param {string[]} modules
     * @memberof InstallTask
     */
    InstallTask.prototype.installAndSave = function (scopes, modules) {
        return __awaiter(this, void 0, void 0, function () {
            var NAME;
            return __generator(this, function (_a) {
                NAME = 'Install new dependencies';
                // const sw = Logger.startStopWatch(NAME);
                // const dependencies = this.loadDependencies(scopes);
                // const resolvedDeps = await this.resolveDependencies(dependencies);
                // writeLockFile(resolvedDeps);
                // const diff = await this.diffLocal(resolvedDeps);
                // const results = await this.createInstallTask(diff);
                // // console.log({ results });
                // Logger.stopStopWatch(sw);
                // process.exit(0);
                throw new Error('Method is not implemented');
            });
        });
    };
    /**
     * Loads all the explicit dependencies from all `package.json`.
     */
    InstallTask.prototype.loadDependencies = function (scopes) {
        if (scopes === void 0) { scopes = 'all'; }
        var packages = [];
        if (scopes === 'all' || scopes.includes(validate_package_1.WorkspaceRoot)) {
            packages.push(env_1.default.rootPkg);
        }
        env_1.default.packages.forEach(function (p) {
            var pkg = env_1.default.packageMap[p];
            if (scopes === 'all' || scopes.includes(p)) {
                packages.push(pkg);
            }
        });
        var keys = [
            'dependencies',
            this.options.production ? null : 'devDependencies'
        ].filter(Boolean);
        var dependencies = packages.reduce(function (list, pkgJSON) {
            return list.concat((0, read_deps_1.getAllDependencies)(pkgJSON, keys));
        }, []);
        return dependencies;
    };
    /**
     * Resolves all the dependencies.
     *
     * @param {Dependency[]} dependencies
     * @returns {Promise<VersionInfo[]>}
     */
    InstallTask.prototype.resolveDependencies = function (dependencies, onProgress) {
        return __awaiter(this, void 0, void 0, function () {
            var items, resolved;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(dependencies.map(function (d) { return (0, resolve_deps_1.getMinIncompatibleSet)(d, _this.options['no-cache']); }))];
                    case 1:
                        items = (_a.sent()).flat(1);
                        return [4 /*yield*/, (0, resolve_deps_1.resolveDependencies)(items, [], this.options['no-cache'], onProgress)];
                    case 2:
                        resolved = _a.sent();
                        return [2 /*return*/, resolved];
                }
            });
        });
    };
    InstallTask.prototype.diffLocal = function (dependencies) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO:
                return [2 /*return*/, dependencies];
            });
        });
    };
    InstallTask.prototype.createInstallTask = function (modules, onProgress, onEnd) {
        return (0, download_deps_1.default)(modules, onProgress, onEnd);
    };
    InstallTask.fullName = 'install';
    InstallTask.displayName = 'install';
    InstallTask.aliases = ['i'];
    InstallTask.rules = {
        desc: 'Creates an install task.',
        args: {
            production: {
                desc: 'Installs dependencies as in production environment',
                shorthands: ['P'],
                defaultValue: false
            },
            'no-cache': {
                desc: 'Do not use or write local cache when sending a request',
                defaultValue: false
            }
        }
    };
    return InstallTask;
}(__2.default));
exports.default = InstallTask;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
