"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 21:02:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:20:01
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("@src/index");
const _env_1 = require("@env");
const logger_1 = require("@ui/logger");
const uninstall_1 = require("@@uninstall/scripts/uninstall");
const installTarget = _env_1.default.packages ? [
    ..._env_1.default.packages,
    'root'
] : [];
const defaultPackage = _env_1.default.currentPackage ?? 'root';
const Uninstall = {
    fullName: 'uninstall',
    displayName: 'uninstall',
    aliases: ['uni', 'u', 'del', 'remove'],
    description: 'Uninstall modules',
    usage: '[option] [module-names...] [workspace]',
    args: [
        new commander_1.Argument('[module-names...]', 'NPM package(s) to uninstall')
    ],
    options: [
        new commander_1.Option('--here', `do uninstalling in the current package (${defaultPackage})`).default(false),
        new commander_1.Option('-w, --workspace <workspace...>', 'included packages in the current workspace').choices(installTarget).default(false)
    ],
    exec: async (moduleNames, options) => {
        if (!_env_1.default.packages) {
            logger_1.default.error(`You're outside a espoir workspace.`);
            return index_1.ExitCode.OPERATION_FAILED;
        }
        if (moduleNames.length === 0) {
            const msg = `You must give at least one module.`;
            throw new Error(msg);
        }
        else if (options.here && options.workspace) {
            const msg = `Cannot use \`--here\` and \`--workspace\` at the same time`;
            throw new Error(msg);
        }
        else if (options.here) {
            const target = defaultPackage;
            logger_1.default.info(`Execute uninstalling in "${target}"`);
            return (0, uninstall_1.default)(moduleNames, [target], true);
        }
        else if (options.workspace && options.workspace.length) {
            const packages = options.workspace.reduce((list, ws) => {
                if (ws !== 'root' && !_env_1.default.packages.includes(ws)) {
                    logger_1.default.warn(`"${ws}" is not a package.`);
                    return list;
                }
                if (list.includes(ws)) {
                    return list;
                }
                return [...list, ws];
            }, []);
            return (0, uninstall_1.default)(moduleNames, packages, true);
        }
        logger_1.default.error(`When calling uninstall, you must give the workspace(s). ${''}If you want to do uninstalling in the current package (${defaultPackage}), use \`--here\` flag.`);
        return index_1.ExitCode.OPERATION_FAILED;
    }
};
exports.default = Uninstall;
