/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 18:27:09 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:59:06
 */

import { Argument, Option } from 'commander';

import RunnableScript from '@runnable';
import env from '@env';
import getRunnableScripts from '@@run/utils/get-runnable-scripts';

import listAll from '@@run/scripts/list-all';
import runScript from '@@run/scripts/run-script';
import { ExitCode } from '@src/index';
import Logger from '@ui/logger';


const workspaces = env.packages ? [
  ...env.packages,
  'root'
] : [];

const RunScript: RunnableScript = {
  fullName: 'run-script',
  displayName: 'run-script',
  aliases: ['run', 'r'],
  description: 'Run arbitrary package scripts',
  usage: '<command> [args...]',
  args: [
    new Argument(
      '[command]',
      'workspace and command, use like `<package-name>.<script-name>` or `<script-name>` with `workspace`'
      + ' implicitly set to the current package'
    ),
    new Argument(
      '[args...]',
      'script arguments'
    )
  ],
  options: [
    new Option(
      '--list',
      'show all supported scripts'
    ).default(false)
  ],
  exec: async (
    cmd: string,
    args: string[],
    options: {
      list: boolean;
    }
  ) => {
    if (!env.rootDir) {
      Logger.error(
        `You're outside a espoir workspace.`
      );

      return ExitCode.OPERATION_FAILED;
    }
    if (!cmd) {
      if (options.list) {
        return await listAll();
      }

      throw new Error('You must give a command.');
    }

    if (workspaces.includes(cmd) && options.list) {
      return await listAll(cmd);
    }

    if (options.list) {
      throw new Error(
        `"${cmd}" is not a workspace. `
      );
    }

    const {
      workspace = env.currentPackage ?? 'root',
      command
    } = new RegExp(
      `^((?<workspace>(${workspaces.join('|')}))\.)?(?<command>[^.]+)$`
    ).exec(cmd)?.groups as {
      workspace: string;
      command: string;
    } | undefined ?? {};

    if (!workspace || !command) {
      throw new Error('Workspace or command is not found.');
    }

    const allScripts = getRunnableScripts(workspace);

    const script = allScripts.find(d => d.name === `${workspace}.${command}`);

    if (!script) {
      throw new Error(`Workspace "${workspace}" has no script named "${command}".`);
    }

    return runScript(workspace, command, script.cmd, script.cwd, args);
  }
};

export default RunScript;
