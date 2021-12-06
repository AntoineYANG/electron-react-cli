/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 18:21:07 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 19:22:26
 */

import { ExitCode } from '@src/index';

import { GitStatus } from '@@contribute/utils/get-git-preset';
import Logger from '@ui/logger';

import gitPreset from './tasks/git-preset';
import changelog from './tasks/changlog';


interface Context {
  state: GitStatus;
  log: string;
}

/**
 * Modify the changes and commit them.
 * 
 * @returns {Promise<ExitCode>}
 */
const commit = async (): Promise<ExitCode> => {
  Logger.info('  Checking git state. ');

  const gitState: Context['state'] = await gitPreset();

  if (gitState.changes.staged.length === 0) {
    Logger.error('Nothing to commit. ');

    return ExitCode.OPERATION_FAILED;
  }
  
  const log: Context['log'] = await changelog(gitState);

  console.log(log);
  process.exit(-1);

  return ExitCode.OK;
};

export default commit;
