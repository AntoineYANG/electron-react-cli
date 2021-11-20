/*
 * @Author: Kanata You 
 * @Date: 2021-11-20 00:14:13 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-21 01:05:27
 */

import * as fs from 'fs';

import type { VersionInfo } from '../../../utils/request/request-npm';
import { LockCheckFailedReason, LockInfo } from './lock';


const checkLocal = (lockInfo: LockInfo): boolean => {
  // real path
  if (!fs.existsSync(lockInfo.target)) {
    lockInfo.failed = LockCheckFailedReason.FILES_NOT_FOUND;
    return false;
  }

  return true;
};

const diffLocal = async (dependencies: VersionInfo[]): Promise<VersionInfo[]> => {
  return dependencies.filter(({ lockInfo }) => {
    if (lockInfo) {
      // check local files
      if (checkLocal(lockInfo)) {
        return false;
      }
    }
    
    return true;
  });
};

export default diffLocal;
