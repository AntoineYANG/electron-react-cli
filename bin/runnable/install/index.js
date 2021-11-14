"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:00:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:15:23
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
var __1 = require("../..");
var __2 = require("..");
var read_deps_1 = require("./utils/read-deps");
var env_1 = require("../../utils/env");
var resolve_deps_1 = require("./utils/resolve-deps");
var lock_1 = require("./utils/lock");
var logger_1 = require("../../utils/ui/logger");
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.params.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.installAll()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 2: return [2 /*return*/, __1.ExitCode.OPERATION_NOT_FOUND];
                }
            });
        });
    };
    InstallTask.prototype.installAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var NAME, sw, dependencies, resolvedDeps, diff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        NAME = 'Install local dependencies';
                        sw = logger_1.default.startStopWatch(NAME);
                        dependencies = this.loadDependencies();
                        return [4 /*yield*/, this.resolveDependencies(dependencies)];
                    case 1:
                        resolvedDeps = _a.sent();
                        (0, lock_1.writeLockFile)(resolvedDeps);
                        logger_1.default.stopStopWatch(sw);
                        process.exit(0);
                        diff = this.diffLocal(dependencies);
                        // await this.createInstallTask(modules);
                        throw new Error('Method is not implemented');
                }
            });
        });
    };
    /**
     * Loads all the explicit dependencies from all `package.json`.
     */
    InstallTask.prototype.loadDependencies = function () {
        // load all `package.json`
        var packages = __spreadArray([
            env_1.default.rootPkg
        ], env_1.default.packages.map(function (p) { return env_1.default.packageMap[p]; }), true);
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
    InstallTask.prototype.resolveDependencies = function (dependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var items, resolved;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(dependencies.map(function (d) { return (0, resolve_deps_1.getMinIncompatibleSet)(d, _this.options['no-cache']); }))];
                    case 1:
                        items = (_a.sent()).flat(1);
                        return [4 /*yield*/, (0, resolve_deps_1.resolveDependencies)(items, [], this.options['no-cache'])];
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
                throw new Error('Method is not implemented');
            });
        });
    };
    InstallTask.prototype.createInstallTask = function (modules) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hoistDependencies(modules)];
                    case 1:
                        _a.sent();
                        throw new Error('Method is not implemented');
                }
            });
        });
    };
    InstallTask.prototype.hoistDependencies = function (modules) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method is not implemented');
            });
        });
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
