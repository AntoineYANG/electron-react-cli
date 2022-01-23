"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 19:14:21
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:06:43
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const child_process_1 = require("child_process");

const inquirer = require("inquirer");

const logger_1 = require("../../../../utils/ui/logger");
/**
 * Collect setup info of new monorepo.
 *
 * @returns {Promise<MonorepoConfig>}
 */


const monorepoSetup = async () => {
  logger_1.default.info('Monorepo setup ');
  const contributors = [];

  try {
    const whoIsMe = (0, child_process_1.execSync)('git config user.name', {
      encoding: 'utf-8'
    }).split('\n')[0];
    contributors.push(`${whoIsMe} ${(0, child_process_1.execSync)('git config user.email', {
      encoding: 'utf-8'
    }).split('\n')[0]}`);
  } catch (error) {}

  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Name of the monorepo:',
    validate: input => {
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
    validate: input => {
      if (input.trim().length === 0) {
        return true;
      }

      return /^https:\/\/github.com\/[^/]+\/[^/]+.git$/.test(input) || `git address must be like ${'"https://github.com/{author}/{name}.git"'}`;
    }
  }, {
    type: 'confirm',
    name: 'ts',
    message: 'Enable TypeScript?',
    default: true
  }]);
  const config = {
    name: answers.name,
    contributors: answers.author ? [answers.author] : [],
    git: answers.git.trim() || undefined,
    packages: [],
    enableTS: answers.ts
  };
  return config;
};

exports.default = monorepoSetup;