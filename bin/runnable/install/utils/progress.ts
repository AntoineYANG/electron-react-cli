/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 01:05:00 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 01:42:20
 */

import * as chalk from 'chalk';
import Logger from '../../../utils/ui/logger';


export enum ProgressTag {
  prepare = 0,
  download = 1,
  'un-compress' = 2,
  unpack = 3,
  done = 10,
  failed = -1
}

const desc: Record<ProgressTag, string> = {
  0:          chalk.blue.bold`[Preparing]`,
  1:      chalk.yellow.bold`[Downloading]`,
  2: chalk.magenta.bold`[Un-compressing]`,
  3:        chalk.magentaBright.bold`[Unpacking]`,
  10:          chalk.greenBright.bold`[Completed]`,
  [-1]:        chalk.red.bold`[Failed]`
};

let tasks: [string, ProgressTag, number][] = [];

/** Mark if the list is already requested to be shown */
let dirty = false;

const NAME_LEN = 30;
const STAGE_LEN = 14;
const MAX_ROWS = 12;
let lines = 0;

let firstTime = true;

/**
 * Displays all progresses.
 */
const display = () => {
  // let the list be sorted
  tasks = tasks.sort((a, b) => {
    if (a[1] !== b[1]) {
      return b[1] - a[1];
    }

    return b[2] - a[2];
  });

  if (firstTime) {
    // print a blank line
    Logger.writeRow('');
    firstTime = false;
  }

  // clear, use '<=' because there's a blank line at the end
  Logger.backRow(Math.min(lines, MAX_ROWS));

  // print
  tasks.slice(0, MAX_ROWS).forEach(t => {
    const name = t[0].slice(0, NAME_LEN);
    const leftSpan = ' '.repeat(NAME_LEN - name.length + 2);
    const stage = desc[t[1]].slice(0, STAGE_LEN) + 2;
    const rightSpan = ' '.repeat(STAGE_LEN - stage.length + 2);
    const p = (
      t[2] === -1 || [ProgressTag.done, ProgressTag.failed].includes(t[1])
    ) ? '' : chalk.green`${(t[2] * 100).toFixed(2)}%`;
    
    Logger.info(
      leftSpan,
      chalk.blueBright.bold(name),
      ' ',
      desc[t[1]],
      rightSpan,
      p,
      ' '.repeat(10)
    );
  });

  lines = tasks.length;
  
  // remove the completed ones
  tasks = tasks.filter(t => ![ProgressTag.done, ProgressTag.failed].includes(t[1]));
  
  if (tasks.length !== lines) {
    process.nextTick(display);
  } else if (resolver) {
    resolver();
    resolver = null;

    // clean the flag
    process.nextTick(() => {
      dirty = false;
    });
  }

  // print a blank line
  Logger.info();
};

let resolver: (() => void) | null = null;

/**
 * Updates progress of a task.
 *
 * @param {string} name the installing package
 * @param {ProgressTag} task label of the stage
 * @param {number} p progress of this stage, (0, 1) or -1 if the rate is meaningless
 * @returns {Promise<void>}
 */
const progress = async (name: string, task: ProgressTag, p: number): Promise<void> => {
  const idx = tasks.map(t => t[0]).indexOf(name);

  if (idx === -1 && ![ProgressTag.done, ProgressTag.failed].includes(task)) {
    tasks.push([name, task, p]);
  } else if (tasks[idx]) {
    const item = tasks[idx] as [string, ProgressTag, number];

    item[1] = task;
    item[2] = p;
  }

  if (!dirty) {
    dirty = true;
    // avoid sync
    process.nextTick(display);

    await new Promise<void>(resolve => {
      resolver = resolve;
    });
  }
};


export default progress;
