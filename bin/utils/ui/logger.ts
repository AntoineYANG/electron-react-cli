/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:35:46 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:26:07
 */

import * as chalk from 'chalk';


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

/**
 * Logging methods.
 *
 * @abstract
 * @class Logger
 */
abstract class Logger {

  static level: LogLevel = LogLevel.ALL;

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

  static startStopWatch(label: string): StopWatch {
    this.info(
      chalk`{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${label}}`
    );

    return new StopWatch(label);
  }

  static stopStopWatch(sw: StopWatch): number {
    const finalCost = sw.stop();
    const time = finalCost < 1_000 ? `${finalCost}ms` : `${
      (finalCost / 1000).toFixed(2).replace(/0+$/, '')
    }s`;

    this.info(
      chalk`{rgb(206,145,91) [StopWatch]} {rgb(0,125,206).bold ${
        sw.label
      }} finished. total cost: {yellow ${time}}`
    );

    return finalCost;
  }

}


export default Logger;
