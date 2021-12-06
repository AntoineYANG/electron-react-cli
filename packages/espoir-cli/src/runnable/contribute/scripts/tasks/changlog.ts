/*
 * @Author: Kanata You 
 * @Date: 2021-12-06 18:24:18 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 19:20:04
 */

import * as inquirer from 'inquirer';

import type { GitStatus } from '@@contribute/utils/get-git-preset';
import Logger from '@ui/logger';
import env from '@env';


export type CommitMsg = {
  type: string;
  scope: string;
  subject: string;
};

/**
 * Initialize context with git info.
 *
 * @returns {Promise<string>}
 */
const changelog = async (state: GitStatus): Promise<string> => {
  Logger.info('Preparing to write CHANGELOG file. ');
  
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: 'Which type best describes this commit?',
    choices: env.configs.commit.types
  }, {
    type: env.configs.commit.scopes ? 'list' : 'input',
    name: 'scope',
    message: 'Which parts are effected in this commit? (separated by `,`)',
    choices: env.configs.commit.scopes ? env.configs.commit.scopes : undefined
  }, {
    type: 'input',
    name: 'subject',
    message: 'Subject of this commit message:'
  }]);

  const msg = ['type', 'scope', 'subject'].reduce<string>((temp, tag) => {
    if (answers[tag]) {
      return temp.replace(new RegExp(`<${tag}\??>`), answers[tag]);
    }

    return temp;
  }, env.configs.commit.format).replace(
    /<.*\?>/g, ''
  );

  return msg;
};


export default changelog;
