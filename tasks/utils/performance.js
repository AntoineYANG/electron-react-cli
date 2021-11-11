/*
 * @Author: Kanata You
 * @Date: 2021-11-11 02:42:50
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 16:07:22
 */

const chalk = require('chalk');

const { formattedTime } = require('./formatters.js');


class StopWatch {
  #label = NaN;
  #startTime = NaN;

  /**
   * Creates and starts a timer.
   *
   * @param {string} label
   * @memberof StopWatch
   */
  constructor(label) {
    this.#label = label;
    this.#startTime = Date.now();
    console.log(chalk`{grey [StopWatch]} {rgb(208,139,0) ${this.#label}} starts`);
  }

  /**
   * Gets the time cost.
   *
   * @returns {number}
   * @memberof StopWatch
   */
  stop() {
    return Date.now() - this.#startTime;
  }

  /**
   * Log the time cost.
   *
   * @returns {number}
   * @memberof StopWatch
   */
  log() {
    const cost = Date.now() - this.#startTime;
    console.log(chalk`{grey [StopWatch]} {rgb(208,139,0) ${this.#label}} cost {yellow ${formattedTime(cost)}}`);
    return cost;
  }
}


module.exports = {
  StopWatch,
};
