"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 01:43:49
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 16:16:09
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
exports.TaskManagerFactory = exports.OptionParseError = void 0;
var listr2_1 = require("listr2");
var OptionParseError = /** @class */ (function (_super) {
    __extends(OptionParseError, _super);
    function OptionParseError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = 'OptionParseError';
        return _this;
    }
    return OptionParseError;
}(Error));
exports.OptionParseError = OptionParseError;
/**
 * A Runnable instance is a context used to execute a certain operation.
 *
 * @class Runnable
 */
var Runnable = /** @class */ (function () {
    function Runnable(args, optionConfig) {
        this.originArgs = args;
        if (!optionConfig) {
            throw new Error('Cannot create an unimplemented Runnable instance');
        }
        this.optionConfig = optionConfig;
        var _a = this.useParsedInput(args), params = _a[0], options = _a[1];
        this.params = params;
        this.options = options;
    }
    Runnable.prototype.exec = function () {
        throw new Error('Cannot call `exec()` on unimplemented Runnable.');
    };
    Runnable.prototype.useParsedInput = function (args) {
        var _this = this;
        var params = [];
        var options = {};
        var uncompletedArg = args.reduce(function (name, arg) {
            var _a;
            if (name === undefined) {
                var match = /^-(?<full>-)?(?<n>[a-zA-Z\-]+)$/.exec(arg);
                if (match) {
                    if (name) {
                        throw new OptionParseError("Argument ".concat(name, " requires a value"));
                    }
                    var _b = match.groups, full_1 = _b.full, n_1 = _b.n;
                    var key = (_a = Object.entries(_this.optionConfig.args).find(function (_a) {
                        var name = _a[0], shorthands = _a[1].shorthands;
                        return (full_1 ? name === n_1 : shorthands === null || shorthands === void 0 ? void 0 : shorthands.includes(n_1));
                    })) === null || _a === void 0 ? void 0 : _a[0];
                    if (!key) {
                        throw new OptionParseError("No argument match \"".concat(n_1, "\""));
                    }
                    var isFlag = !Boolean(_this.optionConfig.args[key].requiresValue);
                    if (isFlag) {
                        options[key] = true;
                        return undefined;
                    }
                    return key;
                }
                params.push(arg);
            }
            else {
                options[name] = arg;
            }
            return undefined;
        }, undefined);
        if (uncompletedArg) {
            throw new OptionParseError("Argument ".concat(uncompletedArg, " requires a value"));
        }
        return [params, options];
    };
    return Runnable;
}());
exports.default = Runnable;
/**
 * @see https://listr2.kilic.dev/task-manager/use-case
 */
var TaskManagerFactory = function (override) {
    var myDefaultOptions = {
        concurrent: false,
        exitOnError: false,
        rendererOptions: {
            collapse: false,
            collapseSkips: false
        }
    };
    return new listr2_1.Manager(__assign(__assign({}, myDefaultOptions), override));
};
exports.TaskManagerFactory = TaskManagerFactory;
