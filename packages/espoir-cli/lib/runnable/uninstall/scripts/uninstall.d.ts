import { ExitCode } from '@src/index';
/**
 * Uninstall dependencies.
 *
 * @param {string[]} moduleNames
 * @param {string[]} scopes
 * @param {boolean} updateLock
 * @returns {Promise<ExitCode>}
 */
declare const uninstallDeps: (moduleNames: string[], scopes: string[], updateLock: boolean) => Promise<ExitCode>;
export default uninstallDeps;
