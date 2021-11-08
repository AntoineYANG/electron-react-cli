/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 18:49:22 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-08 21:47:38
 */

import { exit } from 'process';
// import { resolve } from 'path';
import { program } from 'commander';
import createProject from './create-project';


program.version(VERSION);

program
  .command('project [dir]')
  // .option('')
  .aliases(['p'])
  .action((dir, cmd) => {
    // console.log({ dir, cmd });
    createProject(dir).finally(() => exit(0));
  });
  
program.parse(process.argv);
