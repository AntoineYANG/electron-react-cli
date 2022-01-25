"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-20 00:14:13
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 20:01:08
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const lock_1 = require("./lock");

const checkLocal = lockInfo => {
  // real path
  if (!fs.existsSync(lockInfo.target)) {
    lockInfo.failed = lock_1.LockCheckFailedReason.FILES_NOT_FOUND;
    return false;
  }

  return true;
};

const diffLocal = async dependencies => {
  return dependencies.filter(({
    lockInfo
  }) => {
    if (lockInfo) {
      // check local files
      if (checkLocal(lockInfo)) {
        return false;
      }
    }

    return true;
  });
};

exports.default = diffLocal;