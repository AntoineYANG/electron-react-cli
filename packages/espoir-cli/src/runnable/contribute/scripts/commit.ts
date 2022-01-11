/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 18:21:07 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-11 19:34:13
 */

import { execSync } from 'child_process';

import { ExitCode } from '@src/index';

import { GitStatus } from '@@contribute/utils/get-git-preset';
import Logger from '@ui/logger';

import gitPreset from './tasks/git-preset';
import changelog from './tasks/changlog';
import pushRemote from './tasks/push-remote';


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

  const res = execSync(
    `git commit -m "${log.replace('"', '\"')}"`, {
      encoding: 'utf-8'
    }
  );

  Logger.info(res);

  const resPush = await pushRemote(gitState);

  Logger.info(resPush);


  return ExitCode.OK;
};

export default commit;
