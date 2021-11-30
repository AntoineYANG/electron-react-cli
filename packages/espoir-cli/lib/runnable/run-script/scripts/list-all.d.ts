import { ExitCode } from '@src/index';
/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {string[]}
 */
declare const listAll: (scope?: string | undefined) => Promise<ExitCode>;
export default listAll;
