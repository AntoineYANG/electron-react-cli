"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:35:46
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:26:07
 */
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopWatch = exports.LogLevel = void 0;
var chalk = require("chalk");
/* eslint-disable no-console */
var LogLevel;
(function (LogLevel) {
    LogLevel["NONE"] = "";
    LogLevel["ERROR"] = "error";
    LogLevel["ERROR_WARNING"] = "error|warning";
    LogLevel["ALL"] = "error|warning|info";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var StopWatch = /** @class */ (function () {
    function StopWatch(label) {
        this.label = label;
        this.beginTime = Date.now();
        var resolvers = [];
        this.endTime = new Promise(function (resolver) {
            resolvers.push(resolver);
        });
        this.finalCost = new Promise(function (resolver) {
            resolvers.push(resolver);
        });
        this.resolvers = resolvers;
        this._ms = 0;
    }
    Object.defineProperty(StopWatch.prototype, "ms", {
        get: function () {
            var now = Date.now();
            this._ms = now - this.beginTime;
            return this._ms;
        },
        enumerable: false,
        configurable: true
    });
    StopWatch.prototype.stop = function () {
        var now = Date.now();
        this._ms = now - this.beginTime;
        this.resolvers[0](now);
        this.resolvers[1](this._ms);
        return this._ms;
    };
    return StopWatch;
}());
exports.StopWatch = StopWatch;
/**
 * Logging methods.
 *
 * @abstract
 * @class Logger
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.info = function () {
        var msgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msgs[_i] = arguments[_i];
        }
        if (this.level.includes('info')) {
            console.info.apply(console, msgs);
            return true;
        }
        return false;
    };
    Logger.warn = function () {
        var msgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msgs[_i] = arguments[_i];
        }
        if (this.level.includes('warning')) {
            console.warn.apply(console, msgs);
            return true;
        }
        return false;
    };
    Logger.error = function () {
        var msgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msgs[_i] = arguments[_i];
        }
        if (this.level.includes('error')) {
            console.error.apply(console, msgs);
            return true;
        }
        return false;
    };
    Logger.startStopWatch = function (label) {
        this.info(chalk(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ", "}"], ["{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ", "}"])), label));
        return new StopWatch(label);
    };
    Logger.stopStopWatch = function (sw) {
        var finalCost = sw.stop();
        var time = finalCost < 1000 ? finalCost + "ms" : (finalCost / 1000).toFixed(2).replace(/0+$/, '') + "s";
        this.info(chalk(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ", "} finished. total cost: {yellow ", "}"], ["{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ", "} finished. total cost: {yellow ", "}"])), sw.label, time));
        return finalCost;
    };
    Logger.level = LogLevel.ALL;
    return Logger;
}());
exports.default = Logger;
var templateObject_1, templateObject_2;
