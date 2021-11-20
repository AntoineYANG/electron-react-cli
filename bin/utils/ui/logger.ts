/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:35:46 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 23:28:43
 */

import * as fs from 'fs';
import { sync as mkdirp } from 'mkdirp';
import * as chalk from 'chalk';
import * as logUpdate from 'log-update';

import env from '../../utils/env';


/* eslint-disable no-console */

export enum LogLevel {
  NONE = '',
  ERROR = 'error',
  ERROR_WARNING = 'error|warning',
  ALL = 'error|warning|info',
}

export class StopWatch {

  readonly label: string;
  readonly beginTime: number;

  readonly endTime: Promise<number>;
  private _ms: number;
  get ms() {
    const now = Date.now();
    this._ms = now - this.beginTime;

    return this._ms;
  }
  readonly finalCost: Promise<number>;

  private resolvers: [
    (time: number) => void,
    (ms: number) => void
  ];

  constructor(label: string) {
    this.label = label;
    this.beginTime = Date.now();
    const resolvers: ((time: number) => void)[] = [];
    this.endTime = new Promise<number>(resolver => {
      resolvers.push(resolver);
    });
    this.finalCost = new Promise<number>(resolver => {
      resolvers.push(resolver);
    });
    this.resolvers = resolvers as [
      (time: number) => void,
      (ms: number) => void
    ];
    this._ms = 0;
  }

  stop(): number {
    const now = Date.now();
    this._ms = now - this.beginTime;

    this.resolvers[0](now);
    this.resolvers[1](this._ms);

    return this._ms;
  }

}

const logDir = env.resolvePath(
  '.espoir',
  'logs'
);
const today = new Date();
const logFile = env.resolvePath(
  '.espoir',
  'logs',
  `${today.toISOString().split('T')[0]}.log`
);

/**
 * Logging methods.
 *
 * @abstract
 * @class Logger
 */
abstract class Logger {

  static level: LogLevel = LogLevel.ALL;

  static get path() {
    return logFile;
  }

  private static saveLog(tag: string, msg: string): void {
    if (!fs.existsSync(logDir)) {
      mkdirp(logDir);
    }

    const formattedMsg = `<${tag}>[${
      new Date().toISOString()
    }]\n${msg}\n\n`;

    fs.appendFileSync(this.path, formattedMsg);
  }

  static log(msg: string): void {
    this.saveLog('log', msg);
  }

  static info(...msgs: any[]): boolean {
    if (this.level.includes('info')) {
      console.info(...msgs);

      return true;
    }

    return false;
  }

  static warn(...msgs: any[]): boolean {
    if (this.level.includes('warning')) {
      console.warn(...msgs);

      return true;
    }

    return false;
  }

  static error(...msgs: any[]): boolean {
    if (this.level.includes('error')) {
      console.error(...msgs);

      return true;
    }

    return false;
  }

  static logError(err: Error): boolean {
    this.saveLog('error', err.message + '\n' + err.stack ?? '');
    
    if (this.level.includes('error')) {
      console.error(
        chalk`{redBright {bold \u2716 }${err.name}: ${err.message} }`
      );

      console.info(
        chalk`{blue 🗊 See ${logFile} for more details.}`
      );

      return true;
    }

    return false;
  }

  static startStopWatch(label: string): StopWatch {
    if (this.level.includes('info')) {
      this.info(
        chalk`{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${label}}`
      );
    }

    this.saveLog('preference', `"${label}" begins. `);

    return new StopWatch(label);
  }

  static stopStopWatch(sw: StopWatch): number {
    const finalCost = sw.stop();
    const time = finalCost < 1_000 ? `${finalCost}ms` : `${
      (finalCost / 1000).toFixed(2).replace(/0+$/, '')
    }s`;

    if (this.level.includes('info')) {
      this.info(
        chalk`{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${
          sw.label
        }} finished. total cost: {yellow ${time}}`
      );
    }

    this.saveLog('preference', `"${sw.label}" finished. (total cost: ${time})`);

    return finalCost;
  }

  static writeCanOverwrite(content: string): void {
    logUpdate(content);
  }

  static clearRow(): void {
    logUpdate.clear();
  }

}


export default Logger;
