"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 01:43:49
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-23 19:59:37
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskManagerFactory = void 0;

const listr2_1 = require("listr2");
/**
 * @see https://listr2.kilic.dev/task-manager/use-case
 */


const TaskManagerFactory = override => {
  const myDefaultOptions = {
    concurrent: false,
    exitOnError: false,
    rendererOptions: {
      collapse: false,
      collapseSkips: false
    }
  };
  return new listr2_1.Manager({ ...myDefaultOptions,
    ...override
  });
};

exports.TaskManagerFactory = TaskManagerFactory;