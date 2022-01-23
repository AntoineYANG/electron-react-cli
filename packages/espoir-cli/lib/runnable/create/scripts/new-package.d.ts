import { ExitCode } from '@src/index';
/**
 * Create new package in this monorepo.
 *
 * @returns {Promise<ExitCode>}
 */
declare const newPackage: () => Promise<ExitCode>;
export default newPackage;
