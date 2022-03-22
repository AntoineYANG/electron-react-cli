/*
 * @Author: Kanata You 
 * @Date: 2022-01-26 14:10:10 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-03-22 14:23:36
 */

import * as semver from 'semver';
import * as chalk from 'chalk';

import request from '@request';
import { getAvailableVersions } from '@@install/utils/resolve-deps';
import env from '@env';
import logger from '@ui/logger';
import { ChangLogItemType, parseChangelog, printChangelog } from '@@contribute/utils/write-changelog';


const checkUpdate = async (
  timeout: number = 1000
) => new Promise<void>(async resolve => {
  if (process.argv.includes('update')) {
    return resolve();
  }

  setTimeout(() => {
    resolve();
  }, timeout);
  
  const {
    name,
    version: curVersion,
    github
  } = env.runtime.espoir;

  const curSemver = semver.valid(semver.coerce(curVersion)) as string;

  const [err, list] = await getAvailableVersions(
    name,
    `>${curSemver}`,
    {}
  );

  if (err) {
    if ((err.message ?? '').startsWith('No version of "')) {
      return resolve();
    }

    logger.logError(err);
    
    return resolve();
  }

  if (list?.length) {
    const latest = list[0]?.version as string;
    const latestSemver = semver.valid(semver.coerce(latest)) as string;
    const latestMajor = semver.major(latestSemver);

    const doMajorsDiffer = latestMajor > semver.major(curSemver);

    let infoHead = '';
    let updateDetail = '';

    if (doMajorsDiffer) {
      infoHead = chalk.bgGreen.white('NEW MAJOR VERSION AVAILABLE');

      const [_err, data] = await request.get<string>(
        `https://unpkg.com/${name}@${latest}/CHANGELOG-${latestMajor}.x.md`
      );

      if (data) {
        try {
          const changelog = parseChangelog(data).filter(
            item => item.type === ChangLogItemType.version && (
              semver.gt(semver.valid(semver.coerce(item.version)) as string, curSemver)
            )
          );

          if (changelog.length) {
            updateDetail = `${
              chalk.yellow('Bugfix messages:')
            }\n${
              printChangelog(changelog, ['feature', '']).split('\n').reduce<string[]>(
                (lines, line, i, list) => {
                  if (lines.length === 20) {
                    return [...lines, `... (${list.length - i - 1} lines hidden)`]
                  } else if (lines.length < 20 && line.trim().length) {
                    return [...lines, line];
                  }

                  return lines;
                }, []
              ).join('\n')
            }`;
          }
        } catch (error) {}
      }

      updateDetail += chalk.blue(
        `---\nCheck for the latest document: ${github}`
      );
    } else {
      const doMinorsDiffer = semver.minor(latestSemver) > semver.minor(curSemver);
  
      if (doMinorsDiffer) {
        infoHead = chalk.bgRedBright.white('UPDATE AVAILABLE');

        const [_err, data] = await request.get<string>(
          `https://unpkg.com/${name}@${latest}/CHANGELOG-${latestMajor}.x.md`
        );

        if (data) {
          try {
            const changelog = parseChangelog(data).filter(
              item => item.type === ChangLogItemType.version && (
                semver.gt(semver.valid(semver.coerce(item.version)) as string, curSemver)
              )
            );

            if (changelog.length) {
              updateDetail = `${
                chalk.yellow('Forward changes:')
              }\n${
                printChangelog(changelog).split('\n').reduce<string[]>(
                  (lines, line, i, list) => {
                    if (lines.length === 20) {
                      return [...lines, `... (${list.length - i - 1} lines hidden)`]
                    } else if (lines.length < 20 && line.trim().length) {
                      return [...lines, line];
                    }

                    return lines;
                  }, []
                ).join('\n')
              }`;
            }
          } catch (error) {}
        }
      } else {
        const doPatchesDiffer = semver.patch(latestSemver) > semver.patch(curSemver);
    
        if (doPatchesDiffer) {
          infoHead = chalk.red.bold('NEW PATCH AVAILABLE');

          const [_err, data] = await request.get<string>(
            `https://unpkg.com/${name}@${latest}/CHANGELOG-${latestMajor}.x.md`
          );

          if (data) {
            try {
              const changelog = parseChangelog(data).filter(
                item => item.type === ChangLogItemType.version && (
                  semver.gt(semver.valid(semver.coerce(item.version)) as string, curSemver)
                )
              );

              if (changelog.length) {
                updateDetail = `${
                  chalk.yellow('Bugfix messages:')
                }\n${
                  printChangelog(changelog, ['bugfix']).split('\n').reduce<string[]>(
                    (lines, line, i, list) => {
                      if (lines.length === 20) {
                        return [...lines, `... (${list.length - i - 1} lines hidden)`]
                      } else if (lines.length < 20 && line.trim().length) {
                        return [...lines, line];
                      }

                      return lines;
                    }, []
                  ).join('\n')
                }`;
              }
            } catch (error) {}
          }
        } else {
          return resolve();
        }
      }
    }

    logger.info(chalk.blue('-'.repeat(40)));
    
    logger.info(infoHead);

    logger.info(
      chalk.yellow('\u26a0'),
      `${
        chalk.cyan(`The latest available version of \`${name}\` is `)
      }${
        chalk.bold.greenBright(latest)
      }${
        chalk.cyan('. Your current version is ')
      }${
        chalk.blue.bold(curVersion)
      }${
        chalk.cyan('. ')
      }`
    );

    if (updateDetail) {
      logger.info(updateDetail);
    }
    
    logger.info();
    logger.info(
      `Run ${
        chalk.blueBright('espoir update')
      } to update espoir globally.`
    );

    logger.info(chalk.blue('-'.repeat(40)));

    logger.info();

    return resolve();
  }
});


export default checkUpdate;
