import type { VersionInfo } from '@request/request-npm';
import type { SingleDependency } from './load-dependencies';
import type { LockData } from './lock';
/**
 * Returns available versions of a module.
 * Results is sorted by version in descending order.
 *
 * @param {string} name
 * @param {string} version
 * @param {LockData} lockData
 * @returns {(Promise<[null, VersionInfo[]] | [Error, null]>)}
 */
export declare const getAvailableVersions: (name: string, version: string, lockData: LockData) => Promise<[null, VersionInfo[]] | [Error, null]>;
/**
 * Resolves all the dependencies given in package.json.
 *
 * @param {SingleDependency[]} dependencies
 * @param {Readonly<LockData>} lockData
 * @param {(resolved: number, unresolved: number) => void} [onProgress]
 * @returns {Promise<VersionInfo[]>}
 */
export declare const resolvePackageDeps: (dependencies: SingleDependency[], lockData: Readonly<LockData>, onProgress?: ((resolved: number, unresolved: number) => void) | undefined) => Promise<VersionInfo[]>;
