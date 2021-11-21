/*
 * @Author: Kanata You 
 * @Date: 2021-11-20 00:00:33 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-22 00:02:18
 */

import * as chalk from 'chalk';

import { ExitCode } from '../../..';
import { TaskManagerFactory } from '../..';
import loadDependencies, { SingleDependency } from '../utils/load-dependencies';
import { resolvePackageDeps } from '../utils/resolve-deps';
import type { VersionInfo } from '../../../utils/request/request-npm';
import { createLockData, LockData, useLockFileData, writeLockFile } from '../utils/lock';
import batchDownload, { InstallResult } from '../utils/download-deps';
import map from '../utils/map';
import diffLocal from '../utils/diff-local';


/**
 * Install local dependencies.
 * 
 * @param {boolean} isProd
 * @param {string[]} scopes
 * @returns {Promise<ExitCode>}
 */
const installAll = async (
  isProd: boolean,
  scopes: string[]
): Promise<ExitCode> => {
  const tasks = TaskManagerFactory<{
    dependencies: SingleDependency[];
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
    installResults: InstallResult[];
  }>();

  tasks.add([{
    title: 'Loading all the explicit dependencies from all `package.json`.',
    task: (ctx, task) => {
      task.output = 'Resolving `package.json`';
      ctx.dependencies = loadDependencies(scopes, isProd);
      task.output = 'Successfully resolved `package.json`';
    }
  }, {
    title: 'Resolving declared dependencies.',
    task: async (ctx, task) => {
      task.output = 'Viewing declared dependencies';
      const printProgress = (resolved: number, unresolved: number) => {
        task.output = chalk` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
      };
      ctx.lockData = useLockFileData();
      ctx.resolvedDeps = await resolvePackageDeps(
        ctx.dependencies,
        ctx.lockData,
        printProgress
      );

      task.output = 'Successfully resolved declared dependencies';
    }
  }, {
    title: 'Diffing local files.',
    task: async (ctx, task) => {
      task.output = 'Checking installed modules';
      ctx.diff = await diffLocal(ctx.resolvedDeps);
      ctx.lockData = createLockData(ctx.lockData, ctx.diff);
      task.output = 'Diffing succeeded';
    }
  }, {
    title: 'Installing resolved modules.',
    task: (ctx, task) => {
      task.output = chalk`🧱 {yellow.bold ${ctx.diff.length} }modules will be installed `;

      const printProgress = (
        completed: string[], failed: string[], total: string[]
      ) => {
        const pending = total.length - completed.length - failed.length;
        let output = chalk`🧱 {yellow.bold ${ctx.diff.length} }modules will be installed `;

        if (pending) {
          output += chalk` {yellow ${pending} pending }`;
        }
        
        if (completed.length) {
          output += chalk` {green ${completed.length} succeeded }`;
        }

        if (failed.length) {
          output += chalk` {red ${failed.length} failed }`;
        }

        task.output = output;
      };

      ctx.installResults = [];
      
      const subtasks = batchDownload(
        ctx.diff, printProgress, res => ctx.installResults.push(res)
      );
      
      return task.newListr(
        subtasks, {
          concurrent: true,
          rendererOptions: {
            collapse: true
          }
        }
      );
    }
  }, {
    title: 'Linking.',
    task: async (ctx, task) => {
      task.output = 'Linking /node_modules/';
      await map(ctx.dependencies, ctx.lockData, ctx.installResults);
      task.output = 'Linked successfully';
    }
  }, {
    title: 'Saving lock file.',
    task: (ctx, task) => {
      task.output = 'Saving espoir lock file';
      writeLockFile(ctx.lockData);
      task.output = 'Espoir lock file saved';
    }
  }], {
    exitOnError: true,
    concurrent: false
  });

  const _ctx = await tasks.runAll();

  return ExitCode.OK;
};

export default installAll;
