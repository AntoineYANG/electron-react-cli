"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-28 15:41:58
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:56:24
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const semver = require("semver");

const chalk = require("chalk");

const _env_1 = require("../../../utils/env");

const _request_1 = require("../../../utils/request");

const write_changelog_1 = require("../../contribute/utils/write-changelog");

const logger_1 = require("../../../utils/ui/logger");

const printUpdateDetail = async version => {
  const curSemver = semver.valid(semver.coerce(_env_1.default.runtime.espoir.version));
  const major = parseInt(version.split('.')[0], 10);
  const [_err, data] = await _request_1.default.get(`https://unpkg.com/${name}@${version}/CHANGELOG-${major}.x.md`);

  if (data) {
    try {
      const changelog = (0, write_changelog_1.parseChangelog)(data).filter(item => item.type === write_changelog_1.ChangLogItemType.version && semver.gt(semver.valid(semver.coerce(item.version)), curSemver));

      if (changelog.length) {
        const updateDetail = `${chalk.yellow('See what is updated:')}\n${(0, write_changelog_1.printChangelog)(changelog).split('\n').reduce((lines, line, i, list) => {
          if (lines.length === 36) {
            return [...lines, `... (${list.length - i - 1} lines hidden)`];
          } else if (lines.length < 36 && line.trim().length) {
            return [...lines, line];
          }

          return lines;
        }, []).join('\n')}`;
        logger_1.default.info(updateDetail);
        logger_1.default.info(chalk.blue(`---\nCheck for the latest document: ${_env_1.default.runtime.espoir.github}`));
      }
    } catch (error) {}
  }
};

exports.default = printUpdateDetail;