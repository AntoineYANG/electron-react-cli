import type { GitStatus } from '@@contribute/utils/get-git-preset';
/**
 * Pushes committed version to remote repository.
 *
 * @returns {Promise<string>}
 */
declare const pushRemote: (state: GitStatus) => Promise<string>;
export default pushRemote;
