"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-30 18:27:09
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:59:06
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const _env_1 = require("@env");
const get_runnable_scripts_1 = require("@@run/utils/get-runnable-scripts");
const list_all_1 = require("@@run/scripts/list-all");
const run_script_1 = require("@@run/scripts/run-script");
const index_1 = require("@src/index");
const logger_1 = require("@ui/logger");
const workspaces = _env_1.default.packages ? [
    ..._env_1.default.packages,
    'root'
] : [];
const RunScript = {
    fullName: 'run-script',
    displayName: 'run-script',
    aliases: ['run', 'r'],
    description: 'Run arbitrary package scripts',
    usage: '<command> [args...]',
    args: [
        new commander_1.Argument('[command]', 'workspace and command, use like `<package-name>.<script-name>` or `<script-name>` with `workspace`'
            + ' implicitly set to the current package'),
        new commander_1.Argument('[args...]', 'script arguments')
    ],
    options: [
        new commander_1.Option('--list', 'show all supported scripts').default(false)
    ],
    exec: async (cmd, args, options) => {
        if (!_env_1.default.rootDir) {
            logger_1.default.error(`You're outside a espoir workspace.`);
            return index_1.ExitCode.OPERATION_FAILED;
        }
        if (!cmd) {
            if (options.list) {
                return await (0, list_all_1.default)();
            }
            throw new Error('You must give a command.');
        }
        if (workspaces.includes(cmd) && options.list) {
            return await (0, list_all_1.default)(cmd);
        }
        if (options.list) {
            throw new Error(`"${cmd}" is not a workspace. `);
        }
        const { workspace = _env_1.default.currentPackage ?? 'root', command } = new RegExp(`^((?<workspace>(${workspaces.join('|')}))\.)?(?<command>[^.]+)$`).exec(cmd)?.groups ?? {};
        if (!workspace || !command) {
            throw new Error('Workspace or command is not found.');
        }
        const allScripts = (0, get_runnable_scripts_1.default)(workspace);
        const script = allScripts.find(d => d.name === `${workspace}.${command}`);
        if (!script) {
            throw new Error(`Workspace "${workspace}" has no script named "${command}".`);
        }
        return (0, run_script_1.default)(workspace, command, script.cmd, script.cwd, args);
    }
};
exports.default = RunScript;
