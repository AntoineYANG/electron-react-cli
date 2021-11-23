import { ExitCode } from '@src/index';
/**
 * Install local dependencies.
 *
 * @param {boolean} isProd
 * @param {string[]} scopes
 * @returns {Promise<ExitCode>}
 */
declare const installAll: (isProd: boolean, scopes: string[]) => Promise<ExitCode>;
export default installAll;
