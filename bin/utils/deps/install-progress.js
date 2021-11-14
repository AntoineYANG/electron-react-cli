/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 23:51:56 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-13 02:19:47
 */

const chalk = require('chalk');


/** @type {Record<'view' | 'download' | 'un-compress' | 'unpack' | 'done' | 'failed', number>} */
const step = {
  view:          0,
  download:      1,
  'un-compress': 2,
  unpack:        3,
  done:          10,
  failed:        -1
};

/** @type {Record<keyof typeof step, string>} */
const desc = {
  view:          chalk.blue.bold`[Viewing]`,
  download:      chalk.yellow.bold`[Downloading]`,
  'un-compress': chalk.magenta.bold`[Un-compressing]`,
  unpack:        chalk.magentaBright.bold`[Unpacking]`,
  done:          chalk.greenBright.bold`[Completed]`,
  failed:        chalk.red.bold`[Failed]`
};

/** @type {[string, keyof typeof step, number][]} */
let tasks = [];

/** Mark if the list is already requested to be shown */
let dirty = false;

const NAME_LEN = 30;
const STAGE_LEN = 14;
let lines = 0;

let firstTime = true;

/**
 * Displays all progresses.
 */
const display = () => {
  // clean the flag
  dirty = false;

  // let the list be sorted
  tasks = tasks.sort((a, b) => {
    if (a[1] !== b[1]) {
      return step[b[1]] - step[a[1]];
    }

    return b[2] - a[2];
  });

  if (firstTime) {
    // print a blank line
    console.log();
    firstTime = false;
  }

  // clear, use '<=' because there's a blank line at the end
  for (let i = 0; i <= lines; i += 1) {
    process.stdout.cursorTo(0);
    // eslint-disable-next-line no-magic-numbers
    process.stdout.write(' '.repeat(160));
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0);
    process.stdout.moveCursor(0, -1);
  }

  // print
  tasks.forEach(t => {
    const name = t[0].slice(0, NAME_LEN);
    const leftSpan = ' '.repeat(NAME_LEN - name.length + 2);
    const stage = t[1].slice(0, STAGE_LEN) + 2;
    const rightSpan = ' '.repeat(STAGE_LEN - stage.length + 2);
    const p = (
      t[2] === -1 || ['done', 'failed'].includes(t[1])
    ) ? '' : chalk.green`${(t[2] * 100).toFixed(2)}%`;
    
    console.log(
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
  tasks = tasks.filter(t => t[1] !== 'done' && t[1] !== 'failed');
  
  if (tasks.length !== lines) {
    dirty = true;
    process.nextTick(display);
  } else if (resolver) {
    resolver();
    resolver = null;
  }

  // print a blank line
  console.log();
};

/** @type {(() => void)|null} */
let resolver = null;

/**
 * Updates progress of a task.
 *
 * @param {string} name the installing package
 * @param {keyof typeof step} task label of the stage
 * @param {number} p progress of this stage, (0, 1) or -1 if the rate is meaningless
 * @returns {Promise<void>}
 */
const progress = async (name, task, p) => {
  const idx = tasks.map(t => t[0]).indexOf(name);

  if (idx === -1 && !['done', 'failed'].includes(task)) {
    tasks.push([name, task, p]);
  } else if (tasks[idx]) {
    const item = tasks[idx];

    item[1] = task;
    item[2] = p;
  }

  if (!dirty) {
    dirty = true;
    // avoid sync
    process.nextTick(display);

    await new Promise(resolve => {
      resolver = resolve;
    });
  }
};


module.exports = {
  progress
};
