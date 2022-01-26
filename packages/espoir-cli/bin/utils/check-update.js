"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-26 14:10:10
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 18:52:37
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const semver = require("semver");

const chalk = require("chalk");

const _request_1 = require("./request");

const resolve_deps_1 = require("../runnable/install/utils/resolve-deps");

const _env_1 = require("./env");

const logger_1 = require("./ui/logger");

const write_changelog_1 = require("../runnable/contribute/utils/write-changelog");

const checkUpdate = async () => {
  const {
    name,
    version: curVersion,
    github
  } = _env_1.default.runtime.espoir;
  const curSemver = semver.valid(semver.coerce(curVersion));
  const [err, list] = await (0, resolve_deps_1.getAvailableVersions)(name, `>${curSemver}`, {});

  if (err) {
    if ((err.message ?? '').startsWith('No version of "')) {
      return;
    }

    logger_1.default.logError(err);
    return;
  }

  if (list?.length) {
    const latest = list[0]?.version;
    const latestSemver = semver.valid(semver.coerce(latest));
    const latestMajor = semver.major(latestSemver);
    const doMajorsDiffer = latestMajor > semver.major(curSemver);
    let infoHead = '';
    let updateDetail = '';

    if (doMajorsDiffer) {
      infoHead = chalk.bgGreen.white('NEW MAJOR VERSION AVAILABLE');
      updateDetail = chalk.blue(`Check for the latest document: ${github}`);
    } else {
      const doMinorsDiffer = semver.minor(latestSemver) > semver.minor(curSemver);

      if (doMinorsDiffer) {
        infoHead = chalk.bgRedBright.white('UPDATE AVAILABLE');
        const [_err, data] = await _request_1.default.get(`https://unpkg.com/${name}@${latest}/CHANGELOG-${latestMajor}.x.md`);

        if (data) {
          try {
            const changelog = (0, write_changelog_1.parseChangelog)(data).filter(item => item.type === write_changelog_1.ChangLogItemType.version && semver.gt(semver.valid(semver.coerce(item.version)), curSemver));

            if (changelog.length) {
              updateDetail = `${chalk.yellow('Forward changes:')}\n${(0, write_changelog_1.printChangelog)(changelog).split('\n').reduce((lines, line, i, list) => {
                if (lines.length === 20) {
                  return [...lines, `... (${list.length - i - 1} lines hidden)`];
                } else if (lines.length < 20 && line.trim().length) {
                  return [...lines, line];
                }

                return lines;
              }, []).join('\n')}`;
            }
          } catch (error) {}
        }
      } else {
        const doPatchesDiffer = semver.patch(latestSemver) > semver.patch(curSemver);

        if (doPatchesDiffer) {
          infoHead = chalk.red.bold('NEW PATCH AVAILABLE');
          const [_err, data] = await _request_1.default.get(`https://unpkg.com/${name}@${latest}/CHANGELOG-${latestMajor}.x.md`);

          if (data) {
            try {
              const changelog = (0, write_changelog_1.parseChangelog)(data).filter(item => item.type === write_changelog_1.ChangLogItemType.version && semver.gt(semver.valid(semver.coerce(item.version)), curSemver));

              if (changelog.length) {
                updateDetail = `${chalk.yellow('Bugfix messages:')}\n${(0, write_changelog_1.printChangelog)(changelog, ['bugfix']).split('\n').reduce((lines, line, i, list) => {
                  if (lines.length === 20) {
                    return [...lines, `... (${list.length - i - 1} lines hidden)`];
                  } else if (lines.length < 20 && line.trim().length) {
                    return [...lines, line];
                  }

                  return lines;
                }, []).join('\n')}`;
              }
            } catch (error) {}
          }
        } else {
          return;
        }
      }
    }

    logger_1.default.info(chalk.blue('-'.repeat(40)));
    logger_1.default.info(infoHead);
    logger_1.default.info(chalk.yellow('\u26a0'), `${chalk.cyan(`The latest available version of \`${name}\` is `)}${chalk.bold.greenBright(latest)}${chalk.cyan('. Your current version is ')}${chalk.blue.bold(curVersion)}${chalk.cyan('. ')}`);

    if (updateDetail) {
      logger_1.default.info(updateDetail);
    }

    logger_1.default.info();
    logger_1.default.info(`Run ${chalk.blueBright('espoir update')} to update espoir globally.`);
    logger_1.default.info(chalk.blue('-'.repeat(40)));
    logger_1.default.info();
  }
};

exports.default = checkUpdate;