import { VersionInfo } from '@request/request-npm';
export declare enum LockCheckFailedReason {
    FILES_NOT_FOUND = 1
}
export declare type LockInfo = {
    resolved: string;
    /** exported link */
    entry?: string;
    /** real path */
    target: string;
    integrity: string;
    requires: {
        [name: string]: string;
    };
    failed?: LockCheckFailedReason;
};
export declare type LockItem = {
    [version: string]: LockInfo;
};
export declare type LockData = {
    [name: string]: LockItem;
};
/**
 * Generates espoir lock data from version info.
 *
 * @param {LockData} origin
 * @param {VersionInfo[]} data
 * @returns {LockData}
 */
export declare const createLockData: (origin: LockData, data: VersionInfo[]) => LockData;
/**
 * Writes `.espoir/espoir-lock.json`.
 *
 * @param {LockData} data
 */
export declare const writeLockFile: (data: LockData) => void;
export declare const useLockFileData: () => LockData;
