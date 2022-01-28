/*
 * @Author: Kanata You 
 * @Date: 2022-01-28 16:46:58 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:03:23
 */

import { ExitCode } from '@src/index';
import { TaskManagerFactory } from '@runnable';

import exportPackage from '@@use/scripts/tasks/export-package';


interface Context {}

/**
 * Export package(s) to the whole monorepo.
 * 
 * @param {string[]} packages
 * @returns {Promise<ExitCode>}
 */
const exportPackages = async (packages: string[]): Promise<ExitCode> => {
  const tasks = TaskManagerFactory<Context>();

  tasks.add(
    packages.map(
      name => exportPackage(name)
    ), {
      exitOnError: true,
      concurrent: true
    }
  );

  const _ctx = await tasks.runAll();

  return ExitCode.OK;
};


export default exportPackages;
