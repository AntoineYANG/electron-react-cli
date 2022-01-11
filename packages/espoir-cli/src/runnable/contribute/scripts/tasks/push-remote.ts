/*
 * @Author: Kanata You 
 * @Date: 2021-12-06 18:24:18 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-11 19:27:16
 */

import { execSync } from 'child_process';

import * as inquirer from 'inquirer';

import type { GitStatus } from '@@contribute/utils/get-git-preset';
import Logger from '@ui/logger';


/**
 * Pushes committed version to remote repository.
 *
 * @returns {Promise<string>}
 */
const pushRemote = async (state: GitStatus): Promise<string> => {
  Logger.info('Preparing to write CHANGELOG file. ');
  
  const doPush: boolean = (await inquirer.prompt([{
    type: 'confirm',
    name: 'doPush',
    message: `Push this commit to remote branch origin/${state.curBranch}?`,
    default: true
  }]))['doPush'];

  if (doPush) {
    return execSync(
      `git push origin ${state.curBranch}`, {
        encoding: 'utf-8'
      }
    );
  }

  return '';
};


export default pushRemote;
