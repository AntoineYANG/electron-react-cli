#! /usr/bin/env node

/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:19:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 13:40:52
 */

import { Command } from 'commander';

import RunnableScript from '@runnable';
import env from '@env';
import Logger, { StopWatch } from '@ui/logger';
import checkUpdate from './utils/check-update';

/** @since 1.0.0 */
const Install = env.rootDir ? require('@@install').default as RunnableScript : 0;
/** @since 1.0.0 */
const Uninstall = env.rootDir ? require('@@uninstall').default as RunnableScript : 0;
/** @since 1.0.0 */
const RunScript = env.rootDir ? require('@@run').default as RunnableScript : 0;
/** @since 1.0.0 */
const Contribute = env.rootDir ? require('@@contribute').default as RunnableScript : 0;
/** @since 1.0.0 */
const Create = require('@@create').default as RunnableScript;
/** @since 1.0.0 */
const SelfUpdate = require('@@su').default as RunnableScript;


export enum ExitCode {
  OK = 0,
  OPERATION_FAILED = 1,
  UNDEFINED_BEHAVIOR = 2,
  UNCAUGHT_EXCEPTION = 3,
};

const supportedScripts = [
  Install,
  Uninstall,
  RunScript,
  Contribute,
  Create,
  SelfUpdate
].filter(Boolean) as Array<RunnableScript>;

const program = new Command();

program.name(
  env.runtime.espoir.name
).version(
  env.runtime.espoir.version,
  '-V, --version'
);

const cli = async (argv?: string[]) => {
  let resolve: (value: ExitCode) => void = () => {};

  const run = new Promise<ExitCode>(_resolve => {
    resolve = _resolve;
  });

  // init all the commands
  supportedScripts.forEach(script => {
    let thisCommand = program.command(
      script.fullName
    ).description(
      script.description
    ).aliases(
      script.aliases
    ).usage(
      script.usage
    );

    script.args.forEach(arg => {
      thisCommand = thisCommand.addArgument(arg);
    });

    script.options.forEach(opt => {
      thisCommand = thisCommand.addOption(opt);
    });

    thisCommand.action(async (...args) => {
      const rCode = await script.exec(...args);
      
      return resolve(rCode);
    });
  });

  let sw: StopWatch | null = null;

  // hooks

  let finalize = () => {};
  
  const waitForLifeCycle = new Promise<void>(_resolve => {
    finalize = _resolve;
  });

  const originTitle = process.title;

  program.hook('preAction', (thisCommand, actionCommand) => {
    const title = `${thisCommand.name()}/${actionCommand.name()}`;
    process.title = title;
    sw = Logger.startStopWatch(title);

    process.once('uncaughtException', err => {
      Logger.logError(err);

      if (sw) {
        Logger.stopStopWatch(sw);
      }

      process.title = originTitle;

      resolve(ExitCode.UNCAUGHT_EXCEPTION);
      
      return finalize();
    });
  });

  program.hook('postAction', (thisCommand, actionCommand) => {
    if (sw) {
      Logger.stopStopWatch(sw);
    }

    process.title = originTitle;

    return finalize();
  });

  program.showHelpAfterError('(add --help for additional information)');

  program.showSuggestionAfterError(true);

  await checkUpdate();

  program.parse(argv); // implicitly use process.argv and auto-detect node vs electron conventions

  const rCode = await run;
  
  await waitForLifeCycle;

  return rCode;
};

if (require.main === module) {
  cli().then(
    process.exit
  );
}


export default cli;
