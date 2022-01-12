"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-12 21:38:47
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 22:52:19
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const rmModules = (lockData, requirements, from, modules) => {
  let deleted = [];
  let nextLockData = { ...lockData
  };

  if (from) {
    // remove the requirements of package
    requirements.forEach(req => {
      const which = modules.find(mod => mod.name === req.module.name && req.packages.includes(from));

      if (which) {
        req.packages = req.packages.filter(p => p !== from);
      }
    });
  }

  let recursive = false; // delete local files

  const nextReq = requirements.filter(req => {
    if (req.packages.length === 0 && req.required.length === 0) {
      // ok to delete
      // remove files and link
      fs.rmSync(req.location, {
        force: true,
        recursive: true
      });

      if (req.link) {
        fs.rmSync(req.link);
      } // remove item in lock data


      const curDepLock = nextLockData[req.module.name];

      if (curDepLock) {
        const curVersionLock = curDepLock[req.module.version];

        if (curVersionLock) {
          const {
            [req.module.version]: _,
            ...nDepLock
          } = curDepLock;

          if (Object.keys(nextLockData[req.module.name] ?? {}).length === 1) {
            const {
              [req.module.name]: _,
              ...temp
            } = nextLockData;
            nextLockData = temp;
          } else {
            nextLockData[req.module.name] = nDepLock;
          }
        }
      } // update delete count


      deleted.push(`${req.module.name}@${req.module.version}`); // remove the requirements

      Object.keys(req.requiring).forEach(name => {
        const which = requirements.find(d => d.module.name === name && d.required.includes(req.module.name));

        if (which) {
          which.required = which.required.filter(p => p !== req.module.name);
          recursive = true;
        }
      });
      return false;
    }

    return true;
  });

  if (recursive) {
    const res = rmModules(nextLockData, nextReq, null, []);
    return { ...res,
      deleted: [...deleted, ...res.deleted]
    };
  }

  return {
    lockData: nextLockData,
    requirements: nextReq,
    deleted
  };
};

exports.default = rmModules;