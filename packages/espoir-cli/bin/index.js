"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:19:20
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 19:42:06
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExitCode = void 0;

const commander_1 = require("commander");

const _env_1 = require("./utils/env");

const logger_1 = require("./utils/ui/logger");

const Install = _env_1.default.rootDir ? require("./runnable/install").default : 0;
const Uninstall = _env_1.default.rootDir ? require("./runnable/uninstall").default : 0;
const RunScript = _env_1.default.rootDir ? require("./runnable/run-script").default : 0;
const Contribute = _env_1.default.rootDir ? require("./runnable/contribute").default : 0;

const Create = require("./runnable/create").default;

var ExitCode;

(function (ExitCode) {
  ExitCode[ExitCode["OK"] = 0] = "OK";
  ExitCode[ExitCode["OPERATION_FAILED"] = 1] = "OPERATION_FAILED";
  ExitCode[ExitCode["UNDEFINED_BEHAVIOR"] = 2] = "UNDEFINED_BEHAVIOR";
  ExitCode[ExitCode["UNCAUGHT_EXCEPTION"] = 3] = "UNCAUGHT_EXCEPTION";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));

;
const supportedScripts = [Install, Uninstall, RunScript, Contribute, Create].filter(Boolean);
const program = new commander_1.Command();
program.name(_env_1.default.runtime.espoir.name).version(_env_1.default.runtime.espoir.version, '-V, --version');

const cli = async argv => {
  let resolve = () => {};

  const run = new Promise(_resolve => {
    resolve = _resolve;
  }); // init all the commands

  supportedScripts.forEach(script => {
    let thisCommand = program.command(script.fullName).description(script.description).aliases(script.aliases).usage(script.usage);
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
  let sw = null; // hooks

  let finalize = () => {};

  const waitForLifeCycle = new Promise(_resolve => {
    finalize = _resolve;
  });
  const originTitle = process.title;
  program.hook('preAction', (thisCommand, actionCommand) => {
    const title = `${thisCommand.name()}/${actionCommand.name()}`;
    process.title = title;
    sw = logger_1.default.startStopWatch(title);
    process.once('uncaughtException', err => {
      logger_1.default.logError(err);

      if (sw) {
        logger_1.default.stopStopWatch(sw);
      }

      process.title = originTitle;
      resolve(ExitCode.UNCAUGHT_EXCEPTION);
      return finalize();
    });
  });
  program.hook('postAction', (thisCommand, actionCommand) => {
    if (sw) {
      logger_1.default.stopStopWatch(sw);
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
  cli().then(process.exit);
}

exports.default = cli;