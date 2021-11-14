/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:19:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 23:38:38
 */

import * as chalk from 'chalk';

import { RunnableConstructor } from './runnable';
import InstallTask from './runnable/install';
import Logger from './utils/ui/logger';

// const fs = require('fs');

// const env = require('./utils/env.js');
// const install = require('./scripts/install.js');


export enum ExitCode {
  OPERATION_NOT_FOUND = -2,
  BAD_PARAMS = -1,
  OK = 0,
};

const supportedCommand: Array<RunnableConstructor> = [
  InstallTask
];

const main = async (script: string, args: string[]) => {
  const originTitle = process.title;

  let code: ExitCode = ExitCode.OPERATION_NOT_FOUND;

  const Task = supportedCommand.find(cmd => {
    return cmd.fullName === script || cmd.aliases.includes(script);
  });

  if (Task) {
    
    try {
      const task = new Task(args);
      
      process.title = `espoir script [${Task.displayName}]`;
  
      code = await task.exec();

      if (code !== ExitCode.OK) {
        Logger.error(
          chalk`{redBright {bold \u2716 } {blue.underline [${Task.displayName}]} failed with code {yellow.bold ${code}}.}`
        );
      }
    } catch (err) {
      if (err.name === 'OptionParseError') {
        Logger.error(
          err.message
        );

        code = ExitCode.BAD_PARAMS;
      } else {
        throw err;
      }
    }
  } else {
    Logger.error(
      chalk`{redBright {bold \u2716 } Script "{blue.underline ${script}}" is not found.}`
    );
  }

  process.title = originTitle;

  return code;
};

main(
  process.argv[2] ?? '', process.argv.slice(3)
).then(
  process.exit
);
