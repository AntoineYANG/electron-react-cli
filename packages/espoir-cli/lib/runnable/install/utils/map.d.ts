import { InstallResult } from './download-deps';
import { LockData } from './lock';
import { SingleDependency } from './load-dependencies';
/**
 * Links installed modules to /node_modules/.
 *
 * @param {SingleDependency[]} explicit names of dependencies explicitly declared
 * @param {LockData} lockData generated lock data
 * @param {InstallResult[]} installResults results of installation
 * @param {(log: string) => void} [logProgress]
 * @returns {Promise<void>}
 */
declare const map: (explicit: SingleDependency[], lockData: LockData, installResults: InstallResult[], logProgress?: ((log: string) => void) | undefined) => Promise<void>;
export default map;
