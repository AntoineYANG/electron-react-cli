/*
 * @Author: Kanata You 
 * @Date: 2022-01-12 21:02:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 23:22:12
 */

import { Argument, Option } from 'commander';

import { ExitCode } from '@src/index';
import RunnableScript from '@runnable';
import env from '@env';
import Logger from '@ui/logger';

import uninstallDeps from '@@uninstall/scripts/uninstall';


const installTarget = [
  ...env.packages,
  'root'
];

const defaultPackage = env.currentPackage ?? 'root';

const Uninstall: RunnableScript = {
  fullName: 'uninstall',
  displayName: 'uninstall',
  aliases: ['uni', 'u', 'del', 'remove'],
  description: 'Uninstall modules',
  usage: '[option] [module-names...] [workspace]',
  args: [
    new Argument(
      '[module-names...]',
      'NPM package(s) to uninstall'
    )
  ],
  options: [
    new Option(
      '--here',
      `do uninstalling in the current package (${
        defaultPackage
      })`
    ).default(false),
    new Option(
      '-w, --workspace <workspace...>',
      'included packages in the current workspace'
    ).choices(installTarget).default(false)
  ],
  exec: async (
    moduleNames: string[],
    options: {
      here: boolean;
      workspace: false | string[];
    }
  ) => {
    if (moduleNames.length === 0) {
      const msg = `You must give at least one module.`;

      throw new Error(msg);
    } else if (options.here && options.workspace) {
      const msg = `Cannot use \`--here\` and \`--workspace\` at the same time`;

      throw new Error(msg);
    } else if (options.here) {
      const target = defaultPackage;

      Logger.info(`Execute uninstalling in "${target}"`);
    
      return uninstallDeps(
        moduleNames,
        [target],
        true
      );
    } else if (options.workspace && options.workspace.length) {
      const packages = options.workspace.reduce<string[]>((list, ws) => {
        if (ws !== 'root' && !env.packages.includes(ws)) {
          Logger.warn(`"${ws}" is not a package.`);

          return list;
        }

        if (list.includes(ws)) {
          return list;
        }

        return [...list, ws];
      }, []);
      
      return uninstallDeps(
        moduleNames,
        packages,
        true
      );
    }

    Logger.error(
      `When calling uninstall, you must give the workspace(s). ${
        ''
      }If you want to do uninstalling in the current package (${
        defaultPackage
      }), use \`--here\` flag.`
    );
    

    return ExitCode.OPERATION_FAILED;
  }
};

export default Uninstall;
