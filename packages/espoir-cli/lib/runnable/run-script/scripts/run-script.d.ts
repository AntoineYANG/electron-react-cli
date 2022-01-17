import { ExitCode } from '@src/index';
/**
 * Run a script.
 *
 * @param {string} scope
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<ExitCode>}
 */
declare const runScript: (scope: string, command: string, cmd: string, cwd: string, args: string[]) => Promise<ExitCode>;
export default runScript;
