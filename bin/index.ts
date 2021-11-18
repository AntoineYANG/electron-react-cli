/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:19:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-17 20:26:47
 */

import * as chalk from 'chalk';

import { RunnableConstructor } from './runnable';
import InstallTask from './runnable/install';
import Logger from './utils/ui/logger';


export enum ExitCode {
  OPERATION_NOT_FOUND = -2,
  BAD_PARAMS = -1,
  OK = 0,
  OPERATION_FAILED = 1
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

const cli = async (...args: string[]) => {
  const returnCode = await main(
    args[0] ?? '', args.slice(1)
  );

  return returnCode;
};

if (require.main === module) {
  cli(...process.argv.slice(2)).then(
    process.exit
  );
}


export default cli;
