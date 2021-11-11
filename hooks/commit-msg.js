/*
 * @Author: Kanata You 
 * @Date: 2021-11-11 18:28:59 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-12 01:55:24
 */

const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const parseCommitMessage = require('./utils/parse-commit-message.js');
const logChange = require('./utils/log-change.js');
const { writeCache } = require('./utils/cache.js');


const hook = async () => {
  const message = fs.readFileSync(
    process.argv[2] || '.git/COMMIT_EDITMSG', {
      encoding: 'utf-8'
    }
  ).replace(/\n$/, '');
  const data = parseCommitMessage(message);
  
  if (!data) {
    return -1;
  }
  
  const files = (await logChange(data)).map(f => path.relative('.', f));
  files.forEach(f => {
    console.log(`  Modified ${f}`);
  });

  writeCache('change_logs_to_add', files.join('\n'));
  
  return 0;
};

hook().then(code => {
  if (code === 0) {
    console.log(chalk`{greenBright.bold commit message check succeeded}`);
  } else {
    console.error(chalk`{redBright.bold commit message check failed}`);
  }

  return code;
}).then(process.exit);
