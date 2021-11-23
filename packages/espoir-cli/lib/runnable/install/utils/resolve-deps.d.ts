import { VersionInfo } from '@request/request-npm';
import { SingleDependency } from './load-dependencies';
import { LockData } from './lock';
/**
 * Resolves all the dependencies given in package.json.
 *
 * @param {SingleDependency[]} dependencies
 * @param {Readonly<LockData>} lockData
 * @param {(resolved: number, unresolved: number) => void} [onProgress]
 * @returns {Promise<VersionInfo[]>}
 */
export declare const resolvePackageDeps: (dependencies: SingleDependency[], lockData: Readonly<LockData>, onProgress?: ((resolved: number, unresolved: number) => void) | undefined) => Promise<VersionInfo[]>;
