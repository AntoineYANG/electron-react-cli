/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 19:14:21 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:06:43
 */

import * as fs from 'fs';
import { execSync } from 'child_process';
import * as inquirer from 'inquirer';

import Logger from '@ui/logger';


export type MonorepoConfig = {
  name: string;
  contributors: string[];
  git: string | undefined;
  packages: [];
  enableTS: boolean;
};


/**
 * Collect setup info of new monorepo.
 *
 * @returns {Promise<MonorepoConfig>}
 */
const monorepoSetup = async (): Promise<MonorepoConfig> => {
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
    message: 'Name of the monorepo:',
    validate: (input: string) => {
      if (fs.existsSync(input)) {
        return `${input} already exists`;
      }

      return /^[@a-zA-Z0-9-_]{1,20}$/.test(input) || 'invalid name';
    }
  }, {
    type: 'input',
    name: 'author',
    message: 'Author:',
    default: contributors[0] ?? undefined
  }, {
    type: 'input',
    name: 'git',
    message: 'Git:',
    validate: (input: string) => {
      if (input.trim().length === 0) {
        return true;
      }

      return /^https:\/\/github.com\/[^/]+\/[^/]+.git$/.test(input) || `git address must be like ${
        '"https://github.com/{author}/{name}.git"'
      }`;
    }
  }, {
    type: 'confirm',
    name: 'ts',
    message: 'Enable TypeScript?',
    default: true
  }]);

  const config: MonorepoConfig = {
    name: answers.name,
    contributors: answers.author ? [answers.author] : [],
    git: answers.git.trim() || undefined,
    packages: [],
    enableTS: answers.ts
  };

  return config;
};


export default monorepoSetup;
