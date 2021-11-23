/*
 * @Author: Kanata You 
 * @Date: 2021-11-10 21:31:32 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-10 23:16:52
 */

console.log('hello world');

process.on('unhandledRejection', err => {
  throw err;
});

import { exit } from 'process';
// import { resolve } from 'path';
import { program } from 'commander';
// import createProject from './create-project.js';
program.version('0.0.0-alpha-1.3.0');
program
  .command('project [dir]')
  .description('create a new project')
// .option('')
  .aliases([
    'p'
  ])
  .action((dir, cmd) => {
    // console.log({ dir, cmd });
    // createProject(dir).finally(() => exit(0));
  });
program.parse(process.argv);
