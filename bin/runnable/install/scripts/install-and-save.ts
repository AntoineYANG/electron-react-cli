/*
 * @Author: Kanata You 
 * @Date: 2021-11-20 22:17:42 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-21 02:46:31
 */

import * as chalk from 'chalk';

import { ExitCode } from '../../..';
import { TaskManagerFactory } from '../..';
import loadDependencies, {
  Dependency,
  SingleDependency
} from '../utils/load-dependencies';
import { resolvePackageDeps } from '../utils/resolve-deps';
import type { VersionInfo } from '../../../utils/request/request-npm';
import { createLockData, LockData, useLockFileData, writeLockFile } from '../utils/lock';
import batchDownload, { InstallResult } from '../utils/download-deps';
import map from '../utils/map';
import diffLocal from '../utils/diff-local';
import parseDependencies from '../utils/parse-dependencies';


/**
 * Install modules and save as package dependencies.
 * 
 * @param {string[]} modules
 * @param {string[]} scopes
 * @param {('dependencies' | 'devDependencies')} tag
 * @returns {Promise<ExitCode>}
 */
const installAndSave = async (
  modules: string[],
  scopes: string[],
  tag: 'dependencies' | 'devDependencies'
): Promise<ExitCode> => {
  const tasks = TaskManagerFactory<{
    dependencies: SingleDependency[];
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
    installResults: InstallResult[];
  }>();

  tasks.add([{
    title: 'Viewing dependencies.',
    task: async (ctx, task) => {
      // parse
      task.output = 'Parsing dependencies';
      ctx.dependencies = parseDependencies(modules);
      ctx.lockData = useLockFileData();

      // resolve
      task.output = 'Resolving dependencies';
      const printProgress = (resolved: number, unresolved: number) => {
        task.output = chalk` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
      };
      ctx.resolvedDeps = await resolvePackageDeps(
        ctx.dependencies.map(dep => ({
          name: dep.name,
          versions: [dep.version]
        })),
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
            clearOutput: true,
            collapse: true
          }
        }
      );
    }
  }, {
    title: 'Linking.',
    task: async (ctx, task) => {
      task.output = 'Linking /node_modules/';
      console.log(ctx.installResults.map(d => `${d.name}@${d.version}`));
      process.exit(-1);
      await map(
        ctx.dependencies.map(dep => ({
          name: dep.name,
          versions: [dep.version]
        })),
        ctx.lockData,
        ctx.installResults
      );
      task.output = 'Linked successfully';
    }
  }, {
    title: '?',
    task: (ctx, task) => {
      const failed = ctx.installResults.filter(d => d.err);
      failed.forEach(f => {
        console.log(f.name, f.version);
        console.error(f.err);
      });
      console.log(ctx.installResults.length, failed.length);
      process.exit(-1);
    }
  }], {
    exitOnError: true,
    concurrent: false
  });

  // tasks.add([, {
  //   title: 'Saving lock file.',
  //   task: (ctx, task) => {
  //     task.output = 'Saving espoir lock file';
  //     writeLockFile(ctx.lockData);
  //     task.output = 'Espoir lock file saved';
  //   }
  // }], {
  //   exitOnError: true,
  //   concurrent: false
  // });

  const _ctx = await tasks.runAll();

  return ExitCode.OK;
};

export default installAndSave;
