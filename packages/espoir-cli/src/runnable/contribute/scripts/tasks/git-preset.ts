/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 18:32:55 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 18:25:34
 */

import getGitPreset, { GitStatus } from '@@contribute/utils/get-git-preset';


/**
 * Initialize context with git info.
 *
 * @returns {Promise<GitStatus>}
 */
const gitPreset = async (): Promise<GitStatus> => {
  const state = await getGitPreset();
  
  return state;
};


export default gitPreset;
