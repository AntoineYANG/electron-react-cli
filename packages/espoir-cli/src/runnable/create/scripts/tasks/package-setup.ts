/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 20:17:05 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 21:45:10
 */

import { execSync } from 'child_process';
import * as inquirer from 'inquirer';

import Logger from '@ui/logger';
import env from '@env';
import { getAllSupportedTemplates } from '@@create/utils/load-template';


export type RepoPackageConfig = {
  name: string;
  version: string;
  contributors: string[];
  enableTS: boolean;
  template: string;
};


/**
 * Collect setup info of new monorepo.
 *
 * @returns {Promise<RepoPackageConfig>}
 */
const packageSetup = async (): Promise<RepoPackageConfig> => {
  Logger.info('Monorepo setup ');

  const contributors: string[] = [];

  try {
    const whoIsMe = execSync('git config user.name', {
      encoding: 'utf-8'
    }).split('\n')[0];
    
    contributors.push(`${whoIsMe} ${
      execSync('git config user.email', {
        encoding: 'utf-8'
      }).split('\n')[0]
    }`);
  } catch (error) {}

  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Name of the package:',
    validate: (input: string) => {
      if (env.packages?.includes(input)) {
        return `${input} already exists`;
      }

      return /^[@a-zA-Z0-9-_]{1,20}$/.test(input) || 'invalid name';
    }
  }, {
    type: 'input',
    name: 'version',
    message: 'Version:',
    default: '1.0.0'
  }, {
    type: 'input',
    name: 'author',
    message: 'Author:',
    default: contributors[0] ?? undefined
  }, {
    type: 'list',
    name: 'template',
    message: 'Use template:',
    choices: [
      'none',
      new inquirer.Separator(),
      ...getAllSupportedTemplates().map(d => d.name)
    ],
    default: 'none'
  }, {
    type: 'confirm',
    name: 'ts',
    message: 'Enable TypeScript?',
    default: true
  }]);

  const config: RepoPackageConfig = {
    name: answers.name,
    version: answers.version,
    contributors: answers.author ? [answers.author] : [],
    enableTS: answers.ts,
    template: answers.template
  };

  return config;
};


export default packageSetup;
