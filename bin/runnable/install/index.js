"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:00:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-20 00:18:23
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const __1 = require("../..");
const env_1 = require("../../utils/env");
const install_all_1 = require("./scripts/install-all");
const installTarget = [
    ...env_1.default.packages,
    'root'
];
const Install = {
    fullName: 'install',
    displayName: 'install',
    aliases: ['i', 'ins'],
    description: 'install modules',
    usage: '[option] [module-names...] [workspace]',
    args: [
        new commander_1.Argument('[module-names...]', 'NPM package(s) to install')
    ],
    options: [
        new commander_1.Option('-S, --save', 'install and save as package dependencies').default(true),
        new commander_1.Option('-D, --save-dev', 'install and save as package devDependencies').default(false),
        new commander_1.Option('--production').default(false),
        new commander_1.Option('-w, --workspace <workspace...>', 'included packages in the current workspace').choices(installTarget).default(installTarget, 'all packages')
    ],
    exec: async (moduleNames, options) => {
        if (moduleNames.length === 0) {
            return (0, install_all_1.default)(options.production, options.workspace);
        }
        return __1.ExitCode.OPERATION_FAILED;
    }
};
exports.default = Install;
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
