/*
 * @Author: Kanata You 
 * @Date: 2021-11-11 16:47:30 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 18:23:35
 */

const chalk = require('chalk');

const lint = require('../tasks/lint.js');


const hook = async () => {
  const result = await lint('staged');
  
  return result ? 0 : -1;
};

hook().then(code => {
  if (code === 0) {
    console.log(chalk`{greenBright.bold Lint check succeeded}`);
  } else {
    console.error(chalk`{redBright.bold Lint check failed}`);
  }

  return code;
}).then(process.exit);
