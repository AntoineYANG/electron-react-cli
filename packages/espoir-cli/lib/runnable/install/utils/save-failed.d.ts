import { InstallResult } from './download-deps';
/**
 * Save messages of the modules failed to install.
 *
 * @param {InstallResult[]} installResults results of the installation, allowed to include succeeded ones
 * @returns {(string | null)} if the param includes failure messages, returns the path of the file, otherwise returns null
 */
declare const saveFailed: (installResults: InstallResult[]) => string | null;
export default saveFailed;
