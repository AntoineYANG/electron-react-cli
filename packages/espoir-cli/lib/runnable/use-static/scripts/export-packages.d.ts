import { ExitCode } from '@src/index';
/**
 * Export package(s) to the whole monorepo.
 *
 * @param {string[]} packages
 * @returns {Promise<ExitCode>}
 */
declare const exportPackages: (packages: string[]) => Promise<ExitCode>;
export default exportPackages;
