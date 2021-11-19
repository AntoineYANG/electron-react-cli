/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:19:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 00:43:35
 */

import { Command } from 'commander';

import RunnableScript from './runnable';
import Install from './runnable/install';
import Logger, { StopWatch } from './utils/ui/logger';


export enum ExitCode {
  OK = 0,
  OPERATION_FAILED = 1,
  UNDEFINED_BEHAVIOR = 2,
};

const supportedScripts: Array<RunnableScript> = [
  Install
];

const program = new Command();

// TODO: read from package.json
program.name(
  'espoir-cli'
).version(
  '0.0.0'
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
