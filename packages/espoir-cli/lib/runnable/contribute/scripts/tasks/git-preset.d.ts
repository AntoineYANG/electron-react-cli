import { GitStatus } from '@@contribute/utils/get-git-preset';
/**
 * Initialize context with git info.
 *
 * @returns {Promise<GitStatus>}
 */
declare const gitPreset: () => Promise<GitStatus>;
export default gitPreset;
