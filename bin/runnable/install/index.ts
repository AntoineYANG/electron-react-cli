/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:00:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-19 00:48:40
 */

import * as chalk from 'chalk';
import { ListrTask } from 'listr2';

import { ExitCode } from '../..';
import Runnable, { TaskManagerFactory } from '..';
import { Dependency, DependencyTag, FailedDependency, getAllDependencies, MinIncompatibleSet, SingleDependency } from './utils/read-deps';
import env, { PackageJSON } from '../../utils/env';
import { getMinIncompatibleSet, resolveDependencies } from './utils/resolve-deps';
import type { VersionInfo } from '../../utils/request/request-npm';
import { createLockData, LockData, writeLockFile } from './utils/lock';
import Logger from '../../utils/ui/logger';
import validatePackage, { WorkspaceRoot } from '../../utils/workspace/validate-package';
import batchDownload, { InstallResult } from './utils/download-deps';
import map from './utils/map';


/**
 * Creates an install task.
 * 
 * @export
 * @class InstallTask
 * @extends {Runnable}
 */
export default class InstallTask extends Runnable<typeof InstallTask.rules> {

  static override readonly fullName = 'install';
  static override readonly displayName = 'install';
  static override readonly aliases = ['i'];

  private static readonly rules = {
    desc: 'Creates an install task.',
    args: {
      production: {
        desc: 'Installs dependencies as in production environment',
        shorthands: ['P'],
        defaultValue: false
      },
      'no-cache': {
        desc: 'Do not use or write local cache when sending a request',
        defaultValue: false
      }
    }
  };

  constructor(args: string[]) {
    super(args, InstallTask.rules);
  }

  override async exec() {
    const modules: string[] = [];
    const scopes: string[] = [];

    for (const p of this.params) {
      if (p.startsWith(':')) {
        const scope = validatePackage(p);
  
        if (scope) {
          scopes.push(scope);
        } else {
          Logger.error(
            chalk`{redBright {bold \u2716 } "{blue.bold ${p}}" is not an existing package.}`
          );
  
          return ExitCode.BAD_PARAMS;
        }
      } else {
        modules.push(p);
      }
    }

    try {
      if (modules.length === 0) {
        await this.installAll(scopes.length ? scopes : 'all');

        return ExitCode.OK;
      } else {
        await this.installAndSave(
          scopes.length ? scopes : 'all',
          modules
        );
      }
    } catch (error) {
      Logger.error(error);
      Logger.error(error.stack);

      return ExitCode.OPERATION_FAILED;
    }

    
    return ExitCode.OPERATION_NOT_FOUND;
  }

  /**
   * Install local dependencies.
   * 
   * @private
   * @param {(string[] | 'all')} [scopes='all']
   * @memberof InstallTask
   */
  private async installAll(scopes: string[] | 'all' = 'all'): Promise<void> {
    const NAME = 'Install local dependencies';
    const sw = Logger.startStopWatch(NAME);

    const tasks = TaskManagerFactory<{
      dependencies: Dependency[];
      resolvedDeps: VersionInfo[];
      unsatisfiedDeps: SingleDependency[];
      diff: VersionInfo[];
      lockData: LockData;
      installResults: InstallResult[];
    }>();

    tasks.add([{
      title: 'Loading all the explicit dependencies from all `package.json`.',
      task: (ctx, task) => {
        task.output = 'Resolving `package.json`';
        ctx.dependencies = this.loadDependencies(scopes);
        task.output = 'Successfully resolved `package.json`';
      }
    }, {
      title: 'Resolving declared dependencies.',
      task: async (ctx, task) => {
        task.output = 'Viewing declared dependencies';
        const printProgress = (resolved: number, unresolved: number) => {
          task.output = chalk` \u23f3  {green ${resolved} }dependencies resolved, {yellow ${unresolved} }left`;
        };
        const { succeeded, failed } = await this.resolveDependencies(
          ctx.dependencies,
          printProgress
        );
        ctx.resolvedDeps = succeeded;
        ctx.unsatisfiedDeps = failed;
        ctx.lockData = createLockData(ctx.resolvedDeps);

        if (failed.length) {
          task.output = chalk`Resolved declared dependencies while {red ${
            failed.length
          }} dependencies cannot be satisfied`;
          task.title = chalk`Resolving declared dependencies. {redBright {bold \u2716 } ${
            failed.length
          } unsatisfied }`;
        } else {
          task.output = 'Successfully resolved declared dependencies';
        }
      }
    }, {
      title: 'Diffing local files.',
      task: async (ctx, task) => {
        task.output = 'Checking installed modules';
        ctx.diff = await this.diffLocal(ctx.resolvedDeps);
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
        
        const subtasks = this.createInstallTask(
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
    Logger.stopStopWatch(sw);

    return;
  }

  /**
   * Install new dependencies, and add them to `package.json`.
   * 
   * @private
   * @param {(string[] | 'all')} scopes
   * @param {string[]} modules
   * @memberof InstallTask
   */
  private async installAndSave(scopes: string[] | 'all', modules: string[]) {
    const NAME = 'Install new dependencies';
    // const sw = Logger.startStopWatch(NAME);
    // const dependencies = this.loadDependencies(scopes);
    // const resolvedDeps = await this.resolveDependencies(dependencies);
    // writeLockFile(resolvedDeps);
    // const diff = await this.diffLocal(resolvedDeps);
    // const results = await this.createInstallTask(diff);
    // // console.log({ results });
    // Logger.stopStopWatch(sw);
    // process.exit(0);
    throw new Error('Method is not implemented');
  }

  /**
   * Loads all the explicit dependencies from all `package.json`.
   */
  private loadDependencies(scopes: string[] | 'all' = 'all'): Dependency[] {
    const packages: PackageJSON[] = [];

    if (scopes === 'all' || scopes.includes(WorkspaceRoot)) {
      packages.push(env.rootPkg);
    }

    env.packages.forEach(p => {
      const pkg = env.packageMap[p] as PackageJSON;

      if (scopes === 'all' || scopes.includes(p)) {
        packages.push(pkg);
      }
    });

    const keys = [
      'dependencies',
      this.options.production ? null : 'devDependencies'
    ].filter(Boolean) as DependencyTag[];

    const dependencies = packages.reduce<Dependency[]>((list, pkgJSON) => {
      return list.concat(getAllDependencies(pkgJSON, keys));
    }, []);

    return dependencies;
  }

  /**
   * Resolves all the dependencies.
   *
   * @param {Dependency[]} dependencies
   * @returns {Promise<{ succeeded: VersionInfo[]; failed: FailedDependency[] }>}
   */
  private async resolveDependencies(
    dependencies: Dependency[],
    onProgress?: (resolved: number, unresolved: number) => void
  ): Promise<{ succeeded: VersionInfo[]; failed: FailedDependency[] }> {
    const failed: FailedDependency[] = [];
    
    const items = (
      await Promise.all(
        dependencies.map(async d => {
          const { value, failed: f } = await getMinIncompatibleSet(d, this.options['no-cache']);
          
          if (f.length) {
            d.versions.forEach(v => {
              failed.push({
                name: d.name,
                version: v,
                reasons: f
              });
            });

            return null;
          }
          
          return value;
        })
      )
    ).flat(1).filter(Boolean) as MinIncompatibleSet;

    const resolved = await resolveDependencies(items, [], this.options['no-cache'], onProgress);

    return {
      succeeded: resolved.succeeded,
      failed: resolved.failed.concat(failed)
    };
  }
  
  private async diffLocal(dependencies: VersionInfo[]): Promise<VersionInfo[]> {
    // TODO:
    return dependencies;
  }

  private createInstallTask(
    modules: VersionInfo[],
    onProgress?: (completed: string[], failed: string[], total: string[]) => void,
    onEnd?: (res: InstallResult) => void
  ): ListrTask[] {
    return batchDownload(modules, onProgress, onEnd);
  }

}
