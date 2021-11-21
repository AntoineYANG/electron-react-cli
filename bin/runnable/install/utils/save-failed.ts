/*
 * @Author: Kanata You 
 * @Date: 2021-11-22 00:39:25 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:47:30
 */

import * as fs from 'fs';
import { sync as mkdirp } from 'mkdirp';

import env from '../../../utils/env';
import { InstallResult } from './download-deps';


const dir = env.resolvePath('.espoir');
const fn = env.resolvePath('.espoir', 'failed-to-install.json');

if (!fs.existsSync(dir)) {
  mkdirp(dir);
}

/**
 * Save messages of the modules failed to install.
 *
 * @param {InstallResult[]} installResults results of the installation, allowed to include succeeded ones
 * @returns {(string | null)} if the param includes failure messages, returns the path of the file, otherwise returns null
 */
const saveFailed = (installResults: InstallResult[]): string | null => {
  const failedBefore: InstallResult[] = [];

  if (fs.existsSync(fn)) {
    failedBefore.push(...JSON.parse(
      fs.readFileSync(
        fn, {
          encoding: 'utf-8'
        }
      )
    ) as InstallResult[]);
  }

  const failed = installResults.filter(ir => !ir.data);

  if (failed.length === 0) {
    return null;
  }

  fs.writeFileSync(
    fn,
    JSON.stringify(
      [...failedBefore, failed]
    )
  );

  return fn;
};


export default saveFailed;
