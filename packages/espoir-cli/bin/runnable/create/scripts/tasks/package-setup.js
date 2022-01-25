"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 20:17:05
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 21:45:10
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

const inquirer = require("inquirer");

const logger_1 = require("../../../../utils/ui/logger");

const _env_1 = require("../../../../utils/env");

const load_template_1 = require("../../utils/load-template");
/**
 * Collect setup info of new monorepo.
 *
 * @returns {Promise<RepoPackageConfig>}
 */


const packageSetup = async () => {
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
    message: 'Name of the package:',
    validate: input => {
      if (_env_1.default.packages?.includes(input)) {
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
    choices: ['none', new inquirer.Separator(), ...(0, load_template_1.getAllSupportedTemplates)().map(d => d.name)],
    default: 'none'
  }, {
    type: 'confirm',
    name: 'ts',
    message: 'Enable TypeScript?',
    default: true
  }]);
  const config = {
    name: answers.name,
    version: answers.version,
    contributors: answers.author ? [answers.author] : [],
    enableTS: answers.ts,
    template: answers.template
  };
  return config;
};

exports.default = packageSetup;