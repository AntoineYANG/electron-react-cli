/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:00:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 00:18:23
 */

import { Argument, Option } from 'commander';

import { ExitCode } from '../..';
import RunnableScript from '..';
import env from '../../utils/env';
import installAll from './scripts/install-all';


const installTarget = [
  ...env.packages,
  'root'
]

const Install: RunnableScript = {
  fullName: 'install',
  displayName: 'install',
  aliases: ['i', 'ins'],
  description: 'install modules',
  usage: '[option] [module-names...] [workspace]',
  args: [
    new Argument(
      '[module-names...]',
      'NPM package(s) to install'
    )
  ],
  options: [
    new Option(
      '-S, --save',
      'install and save as package dependencies'
    ).default(true),
    new Option(
      '-D, --save-dev',
      'install and save as package devDependencies'
    ).default(false),
    new Option(
      '--production'
    ).default(false),
    new Option(
      '-w, --workspace <workspace...>',
      'included packages in the current workspace'
    ).choices(installTarget).default(installTarget, 'all packages')
  ],
  exec: async (
    moduleNames: string[],
    options: {
      save: boolean;
      saveDev: boolean;
      production: false;
      workspace: string[];
    }
  ) => {
    if (moduleNames.length === 0) {
      return installAll(options.production, options.workspace);
    }

    return ExitCode.OPERATION_FAILED;
  }
};

export default Install;

// /**
//  * Creates an install task.
//  * 
//  * @export
//  * @class InstallTask
//  * @extends {Runnable}
//  */
// export class InstallTask extends Runnable<typeof InstallTask.rules> {

//   /**
//    * Install new dependencies, and add them to `package.json`.
//    * 
//    * @private
//    * @param {(string[] | 'all')} scopes
//    * @param {string[]} modules
//    * @memberof InstallTask
//    */
//   private async installAndSave(scopes: string[] | 'all', modules: string[]) {
//     const NAME = 'Install new dependencies';
//     // const sw = Logger.startStopWatch(NAME);
//     // const dependencies = this.loadDependencies(scopes);
//     // const resolvedDeps = await this.resolveDependencies(dependencies);
//     // writeLockFile(resolvedDeps);
//     // const diff = await this.diffLocal(resolvedDeps);
//     // const results = await this.createInstallTask(diff);
//     // // console.log({ results });
//     // Logger.stopStopWatch(sw);
//     // process.exit(0);
//     throw new Error('Method is not implemented');
//   }
// }
