"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-06 18:24:18
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-11 19:17:01
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const inquirer = require("inquirer");

const logger_1 = require("../../../../utils/ui/logger");

const _env_1 = require("../../../../utils/env");

const write_changelog_1 = require("../../utils/write-changelog");
/**
 * Initialize context with git info.
 *
 * @returns {Promise<string>} commit message
 */


const changelog = async state => {
  logger_1.default.info('Preparing to write CHANGELOG file. ');
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: 'Which type best describes this commit?',
    choices: _env_1.default.configs.commit.types
  }, {
    type: _env_1.default.configs.commit.scopes ? 'list' : 'input',
    name: 'scope',
    message: 'Which parts are effected in this commit? (separated by `,`)',
    choices: _env_1.default.configs.commit.scopes ? _env_1.default.configs.commit.scopes : undefined
  }, {
    type: 'input',
    name: 'subject',
    message: 'Subject of this commit message:'
  }]);
  const msg = ['type', 'scope', 'subject'].reduce((temp, tag) => {
    if (answers[tag]) {
      return temp.replace(new RegExp(`<${tag}\\??>`), answers[tag]);
    }

    return temp;
  }, _env_1.default.configs.commit.format).replace(/<.*\?>/g, '');
  (0, write_changelog_1.default)(state, (answers['scope'] ?? '').split(',').map(t => t.trim() || 'other'), answers['subject'] ?? '_\<empty message\>_', answers['type'] ?? ' ');
  logger_1.default.info('Successfully updated changelog. ');
  return msg;
};

exports.default = changelog;