"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:35:46
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:29:58
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopWatch = exports.LogLevel = void 0;
const fs = require("fs");
const path = require("path");
const mkdirp_1 = require("mkdirp");
const chalk = require("chalk");
const logUpdate = require("log-update");
const _env_1 = require("@env");
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
const logDir = _env_1.default.rootDir ? _env_1.default.resolvePath('.espoir', 'logs') : 'logs';
const today = new Date();
const logFile = path.join(logDir, `${today.toISOString().split('T')[0]}.log`);
/**
 * Logging methods.
 *
 * @abstract
 * @class Logger
 */
class Logger {
    static level = LogLevel.ALL;
    static get path() {
        return logFile;
    }
    static saveLog(tag, msg) {
        if (!_env_1.default.rootDir) {
            return;
        }
        if (!fs.existsSync(logDir)) {
            (0, mkdirp_1.sync)(logDir);
        }
        const formattedMsg = `<${tag}>[${new Date().toISOString()}]\n${msg}\n\n`;
        fs.appendFileSync(this.path, formattedMsg);
    }
    static log(msg) {
        this.saveLog('log', msg);
    }
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
    static logError(err) {
        const line = fs.readFileSync(this.path, {
            encoding: 'utf-8'
        }).split('\n').length + 1;
        this.saveLog('error', err.message + '\n' + err.stack ?? '');
        if (this.level.includes('error')) {
            console.error(chalk `{redBright {bold \u2716 }${err.name}: ${err.message} }`);
            console.info(chalk `{blue 🗊 See ${logFile}:${line}:1 for more details.}`);
            return true;
        }
        return false;
    }
    static startStopWatch(label) {
        if (this.level.includes('info')) {
            this.info(chalk `{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${label}}`);
        }
        this.saveLog('performance', `"${label}" begins. `);
        return new StopWatch(label);
    }
    static stopStopWatch(sw) {
        const finalCost = sw.stop();
        const time = finalCost < 1_000 ? `${finalCost}ms` : `${(finalCost / 1000).toFixed(2).replace(/0+$/, '')}s`;
        if (this.level.includes('info')) {
            this.info(chalk `{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${sw.label}} finished. total cost: {yellow ${time}}`);
        }
        this.saveLog('performance', `"${sw.label}" finished. (total cost: ${time})`);
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
