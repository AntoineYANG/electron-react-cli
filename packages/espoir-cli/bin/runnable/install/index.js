"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 02:00:17
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:00:35
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const commander_1 = require("commander");

const index_1 = require("../../..");

const _env_1 = require("../../utils/env");

const install_all_1 = require("./scripts/install-all");

const install_and_save_1 = require("./scripts/install-and-save");

const installTarget = [..._env_1.default.packages, 'root'];
const Install = {
  fullName: 'install',
  displayName: 'install',
  aliases: ['i', 'ins'],
  description: 'install modules',
  usage: '[option] [module-names...] [workspace]',
  args: [new commander_1.Argument('[module-names...]', 'NPM package(s) to install')],
  options: [new commander_1.Option('-S, --save', 'install and save as package dependencies').default(true), new commander_1.Option('-D, --save-dev', 'install and save as package devDependencies').default(false), new commander_1.Option('--production').default(false), new commander_1.Option('-w, --workspace <workspace...>', 'included packages in the current workspace').choices(installTarget).default(installTarget, 'all packages')],
  exec: async (moduleNames, options) => {
    if (moduleNames.length === 0) {
      return (0, install_all_1.default)(options.production, options.workspace);
    } else if (options.production) {
      const msg = `When use \`install --production\`, ${'it\'s not supposed to give `moduleNames`. '}`;
      throw new Error(msg);
    } else if (options.saveDev) {
      return (0, install_and_save_1.default)(moduleNames, options.workspace, 'devDependencies');
    } else if (options.save) {
      if (options.workspace.includes('root')) {
        const msg = `${'Cannot install modules as dependencies of the root package. '}${options.workspace === installTarget ? 'Did you forget to set `--workspace|-w` option? ' : ''}`;
        throw new Error(msg);
      } else {
        return (0, install_and_save_1.default)(moduleNames, options.workspace, 'dependencies');
      }
    }

    return index_1.ExitCode.OPERATION_FAILED;
  }
};
exports.default = Install;