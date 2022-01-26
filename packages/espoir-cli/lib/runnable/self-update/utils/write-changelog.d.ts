import type { GitStatus } from './get-git-preset';
export declare enum ChangLogItemType {
    version = 0,
    migration = 1
}
export declare type ChangeLogMigration = {
    type: ChangLogItemType.migration;
    fromMajor: number;
    toMajor: number;
    body: string;
};
export declare type ChangeLogDetail = {
    curBranch: string;
    author: {
        name: string;
        email: string;
    };
    message: string;
    type: string;
    time: number;
};
export declare type ChangeLogVersionComment = {
    type: ChangLogItemType.version;
    version: string;
    body: string;
    details: {
        [scope: string]: ChangeLogDetail[];
    };
};
export declare type ChangeLogData = {
    workspace: string;
    version: string;
    path: string;
    data: Array<ChangeLogMigration | ChangeLogVersionComment>;
};
export declare const parseChangelog: (raw: string) => ChangeLogData['data'];
export declare const printChangelog: (data: ChangeLogData['data'], filter?: string[] | null) => string;
/**
 * Generates change log.
 *
 * @param {GitStatus} state git info
 * @param {string[]} scopes modified scopes
 * @param {string} msg commit message
 * @param {string} type commit type
 * @returns {ChangeLogData[]} modified change log data
 */
declare const writeChangelog: (state: GitStatus, scopes: string[], msg: string, type: string) => ChangeLogData[];
export default writeChangelog;
