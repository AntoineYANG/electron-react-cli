/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 01:05:00 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-17 22:59:03
 */

import * as chalk from 'chalk';


export enum ProgressTag {
  prepare = 0,
  download = 1,
  'un-compress' = 2,
  unpack = 3,
  done = 10,
  failed = -1
}

const desc: Record<ProgressTag, string> = {
  0: 'Preparing',
  1: 'Downloading',
  2: 'Un-compressing',
  3: 'Unpacking',
  10: 'Completed',
  [-1]: 'Failed'
};

const colors: Record<ProgressTag, string> = {
  0: 'blue',
  1: 'yellow',
  2: 'magenta',
  3: 'magentaBright',
  10: 'greenBright',
  [-1]: 'red'
};

let tasks: [string, ProgressTag, number][] = [];

const NAME_LEN = 10;
const PROGRESS_LEN = 32;

/**
 * Updates progress of a task.
 *
 * @param {string} name the installing package
 * @param {ProgressTag} task label of the stage
 * @param {number} p progress of this stage, (0, 1) or -1 if the rate is meaningless
 * @returns {Promise<void>}
 */
const setProgress = async (name: string, task: ProgressTag, p: number): Promise<void> => {
  const idx = tasks.map(t => t[0]).indexOf(name);

  if (idx === -1 && ![ProgressTag.done, ProgressTag.failed].includes(task)) {
    tasks.push([name, task, p]);
  } else if (tasks[idx]) {
    const item = tasks[idx] as [string, ProgressTag, number];

    item[1] = task;
    item[2] = p;
  }
};

const bg = (color: string) => {
  return `bg${color.slice(0, 1).toUpperCase()}${color.slice(1)}`;
};

const stringify = (name: string, tag: ProgressTag, value: number = 0): string => {
  const _name = name.slice(0, NAME_LEN);
  const leftSpan = ' '.repeat(NAME_LEN - _name.length);

  const pDone = Math.round(PROGRESS_LEN * value);
  const pWait = PROGRESS_LEN - pDone;

  const p = chalk`{${bg(colors[tag])} ${' '.repeat(pDone)}}{bgGray ${' '.repeat(pWait)}}`;

  let _v = (value * 100).toFixed(2).slice(0, 5);
  
  if (_v.length < 5) {
    _v = `${' '.repeat(5 - _v.length)}${_v}`;
  }
  const v = chalk.green`${_v}%`;

  const done = tag - 1;
  const waiting = 2 - done;

  const stepInfo = [
    ProgressTag.prepare,
    ProgressTag.done,
    ProgressTag.failed
  ].includes(tag) ? ' ' : (
    chalk` (${
      done ? chalk`{greenBright ${
        '\u25c8 '.repeat(done)
      }}` : ''
    }{rgb(205,185,100) \u25c8 }${
      waiting ? chalk`{gray ${
        '\u25c8 '.repeat(waiting)
      }}` : ''
    }- ${desc[tag]})`
  );

  return (
    `${leftSpan}${chalk.green.bold(_name + ' ')}${p} ${v}${stepInfo}${' '.repeat(16)}`
  );
};


const progress = {
  set: setProgress,
  stringify
};

export default progress;
