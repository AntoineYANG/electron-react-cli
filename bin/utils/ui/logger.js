"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:35:46
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 16:03:27
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopWatch = exports.LogLevel = void 0;
const chalk = require("chalk");
const logUpdate = require("log-update");
/* eslint-disable no-console */
var LogLevel;
(function (LogLevel) {
    LogLevel["NONE"] = "";
    LogLevel["ERROR"] = "error";
    LogLevel["ERROR_WARNING"] = "error|warning";
    LogLevel["ALL"] = "error|warning|info";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class StopWatch {
    label;
    beginTime;
    endTime;
    _ms;
    get ms() {
        const now = Date.now();
        this._ms = now - this.beginTime;
        return this._ms;
    }
    finalCost;
    resolvers;
    constructor(label) {
        this.label = label;
        this.beginTime = Date.now();
        const resolvers = [];
        this.endTime = new Promise(resolver => {
            resolvers.push(resolver);
        });
        this.finalCost = new Promise(resolver => {
            resolvers.push(resolver);
        });
        this.resolvers = resolvers;
        this._ms = 0;
    }
    stop() {
        const now = Date.now();
        this._ms = now - this.beginTime;
        this.resolvers[0](now);
        this.resolvers[1](this._ms);
        return this._ms;
    }
}
exports.StopWatch = StopWatch;
/**
 * Logging methods.
 *
 * @abstract
 * @class Logger
 */
class Logger {
    static level = LogLevel.ALL;
    static info(...msgs) {
        if (this.level.includes('info')) {
            console.info(...msgs);
            return true;
        }
        return false;
    }
    static warn(...msgs) {
        if (this.level.includes('warning')) {
            console.warn(...msgs);
            return true;
        }
        return false;
    }
    static error(...msgs) {
        if (this.level.includes('error')) {
            console.error(...msgs);
            return true;
        }
        return false;
    }
    static startStopWatch(label) {
        this.info(chalk `{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${label}}`);
        return new StopWatch(label);
    }
    static stopStopWatch(sw) {
        const finalCost = sw.stop();
        const time = finalCost < 1_000 ? `${finalCost}ms` : `${(finalCost / 1000).toFixed(2).replace(/0+$/, '')}s`;
        this.info(chalk `{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${sw.label}} finished. total cost: {yellow ${time}}`);
        return finalCost;
    }
    static writeCanOverwrite(content) {
        logUpdate(content);
    }
    static clearRow() {
        logUpdate.clear();
    }
}
exports.default = Logger;
