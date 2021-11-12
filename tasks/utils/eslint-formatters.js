/*
 * @Author: Kanata You
 * @Date: 2021-11-11 13:32:50
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-13 02:21:05
 */

const path = require('path');
const chalk = require('chalk');


const MAX_MSG_LEN = 40;

/**
 * Print eslint results.
 *
 * @param {import('eslint').ESLint.LintResult[]} results
 * @returns {boolean}
 */
const printResults = results => {
  console.log();

  const count = {
    warning:     0,
    warningFile: [],
    error:       0,
    errorFile:   [],
  };
  let outputCount = 0;

  results.forEach(info => {
    const fp = path.relative(path.resolve(__dirname, '..', '..'), info.filePath).replace(/\\/g, '/');
    const insidePackage = (
      /^packages\/(?<p>[-_0-9a-zA-Z]+)\/(?<f>.*)$/.exec(fp) || {
        groups: { p: false, f: fp },
      }
    ).groups;
    const fn = insidePackage.p ? (
      // inside the package [insidePackage]
      chalk`{underline packages/{blueBright.bold ${insidePackage.p}}/${insidePackage.f}}`
    ) : (
      // at the parent dir
      chalk`{underline ${fp}}`
    );

    if (info.messages.length === 0) {
      console.log(chalk` {greenBright \u2714 }`, fn);
    } else {
      /** @type {(import('eslint').Linter.LintMessage)[]} */
      const msgs = [];
      info.messages.forEach(msg => {
        switch (msg.severity) {
          case 0: {
            // off
            break;
          }

          case 1: {
            // warning
            count.warning += 1;
            msgs.push(msg);
            break;
          }

          case 2: {
            // error
            count.error += 1;
            msgs.push(msg);
            break;
          }

          default: {
            break;
          }
        }
      });

      if (msgs.length) {
        if (msgs.filter(m => m.severity === 1).length) {
          count.warningFile.push(info.filePath);
        }
        if (msgs.filter(m => m.severity === 2).length) {
          count.errorFile.push(info.filePath);
        }
        const max = MAX_MSG_LEN - outputCount;
        printMsgs(insidePackage.f, msgs, max);
        outputCount += msgs.length;
      }
    }
  });

  console.log(
    ...[
      '\n',
      count.error > 0
        ? chalk`{redBright.bold Lint check failed. }`
        : count.warning > 0
          ? chalk`{greenBright.bold Lint check succeeded {yellow with warnings}. }`
          : chalk`{greenBright.bold Lint check succeeded. }`,
      count.error ? chalk`\n  {redBright ${count.error} errors} in {redBright ${count.errorFile.length}} files` : null,
      ...(count.error ? count.errorFile.map(fn => chalk`\n    - ${fn}`) : []),
      count.warning
        ? chalk`\n  {yellow ${count.warning} warnings} in {yellow ${count.warningFile.length}} files`
        : null,
      ...(count.warning ? count.warningFile.map(fn => chalk`\n    - ${fn}`) : []),
      '\n',
    ].filter(Boolean)
  );

  return count.error === 0;
};

/**
 * @param {string} fn
 * @param {(import('eslint').Linter.LintMessage)[]} msgs
 * @param {number} max
 */
const printMsgs = (fn, msgs, max) => {
  const errors = msgs.filter(m => m.severity === 2).length;
  const warnings = msgs.filter(m => m.severity === 1).length;

  console.log(
    chalk` {${errors ? 'red' : 'yellow'}.bold \u2716 }`,
    chalk`{underline ${fn}}`,
    chalk`  {gray --}  `,
    ...[
      errors ? chalk`{red.bold ${errors}} errors ` : null,
      warnings ? chalk`{yellow.bold ${warnings}} warnings ` : null
    ].filter(Boolean)
  );

  let rowLen = 1;
  let colLen = 1;
  let detailLen = 1;

  /** @type {[string, string, string, string, string][]} */
  const data = msgs.map(msg => {
    const row = `${msg.line}`;
    const col = `${msg.column}`;

    if (row.length > rowLen) {
      rowLen = row.length;
    }
    if (col.length > colLen) {
      colLen = col.length;
    }

    if (msg.message.length > detailLen) {
      detailLen = msg.message.length;
    }
    return [
      row,
      col,
      {
        1: chalk`{yellow.bold warning}`,
        2: chalk`{red.bold error}`,
      }[msg.severity] || '',
      msg.message,
      msg.ruleId,
    ];
  });

  for (let i = 0; i < data.length; i += 1) {
    if (i >= max) {
      console.log(chalk`    {rgb(171,171,36) ${data.length - i} more messages is hidden}`);
      break;
    }
    const [
      row,
      col,
      tag,
      detail,
      rule
    ] = data[i];
    console.log(
      `${' '.repeat(4 + rowLen - row.length)}${row}:${col}${' '.repeat(1 + colLen - col.length)}`,
      tag,
      ` ${detail}${' '.repeat(2 + detailLen - detail.length)}`,
      chalk`{blueBright ${rule}}`
    );
  }
};


module.exports = {
  printResults,
};
