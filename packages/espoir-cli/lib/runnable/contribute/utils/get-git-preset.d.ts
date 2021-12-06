export declare enum GitChangeState {
    A = "added",
    M = "modified",
    U = "untracked",
    D = "deleted"
}
export declare type GitFileData = {
    name: string;
    type: GitChangeState;
};
export declare type GitChangeInfo = {
    staged: GitFileData[];
    notStaged: GitFileData[];
};
export declare type GitWarning = {
    files: string[];
    reason: string;
    autoFix?: {
        title: string;
        cmd: string;
    }[];
};
export declare type GitStatus = {
    curBranch: string;
    author: {
        name: string;
        email: string;
    };
    changes: GitChangeInfo;
    warnings: GitWarning[];
};
declare const getGitPreset: () => Promise<GitStatus>;
export default getGitPreset;
