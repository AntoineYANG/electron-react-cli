import type { GitStatus } from '@@contribute/utils/get-git-preset';
export declare type CommitMsg = {
    type: string;
    scope: string;
    subject: string;
};
/**
 * Initialize context with git info.
 *
 * @returns {Promise<string>}
 */
declare const changelog: (state: GitStatus) => Promise<string>;
export default changelog;
