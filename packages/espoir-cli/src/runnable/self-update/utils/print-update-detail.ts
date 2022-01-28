/*
 * @Author: Kanata You 
 * @Date: 2022-01-28 15:41:58 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 16:01:49
 */

import * as semver from 'semver';
import * as chalk from 'chalk';

import env from '@env';
import request from '@request';
import { ChangLogItemType, parseChangelog, printChangelog } from '@@contribute/utils/write-changelog';
import logger from '@ui/logger';


const printUpdateDetail = async (version: string) => {
  const curSemver = semver.valid(semver.coerce(env.runtime.espoir.version)) as string;
  const major = parseInt(version.split('.')[0] as string, 10);
  const [_err, data] = await request.get<string>(
    `https://unpkg.com/${env.runtime.espoir.name}@${version}/CHANGELOG-${major}.x.md`
  );

  if (data) {
    try {
      const changelog = parseChangelog(data).filter(
        item => item.type === ChangLogItemType.version && (
          semver.gt(semver.valid(semver.coerce(item.version)) as string, curSemver)
        )
      );

      if (changelog.length) {
        const updateDetail = `${
          chalk.yellow('See what is updated:')
        }\n${
          printChangelog(changelog).split('\n').reduce<string[]>(
            (lines, line, i, list) => {
              if (lines.length === 36) {
                return [...lines, `... (${list.length - i - 1} lines hidden)`]
              } else if (lines.length < 36 && line.trim().length) {
                return [...lines, line];
              }

              return lines;
            }, []
          ).join('\n')
        }`;

        logger.info(updateDetail);
        
        logger.info(chalk.blue(
          `---\nCheck for the latest document: ${env.runtime.espoir.github}`
        ));
      }
    } catch (error) {}
  }
};


export default printUpdateDetail;
