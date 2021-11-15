/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:00:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 01:42:46
 */

import * as chalk from 'chalk';

import { ExitCode } from '../..';
import Runnable from '..';
import { Dependency, DependencyTag, getAllDependencies } from './utils/read-deps';
import env, { PackageJSON } from '../../utils/env';
import { getMinIncompatibleSet, resolveDependencies } from './utils/resolve-deps';
import type { VersionInfo } from '../../utils/request/request-npm';
import { writeLockFile } from './utils/lock';
import Logger from '../../utils/ui/logger';
import validatePackage, { WorkspaceRoot } from '../../utils/workspace/validate-package';
import batchDownload from './utils/download-deps';


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

    if (modules.length === 0) {
      await this.installAll(scopes.length ? scopes : 'all');
    } else {
      await this.installAndSave(
        scopes.length ? scopes : 'all',
        modules
      );
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
  private async installAll(scopes: string[] | 'all' = 'all') {
    const NAME = 'Install local dependencies';
    const sw = Logger.startStopWatch(NAME);
    const dependencies = this.loadDependencies(scopes);
    const resolvedDeps = await this.resolveDependencies(dependencies);
    writeLockFile(resolvedDeps);
    const diff = await this.diffLocal(resolvedDeps);
    const results = await this.createInstallTask(diff);
    Logger.stopStopWatch(sw);
    process.exit(0);
    console.log({ results });
    throw new Error('Method is not implemented');
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
    const sw = Logger.startStopWatch(NAME);
    const dependencies = this.loadDependencies(scopes);
    const resolvedDeps = await this.resolveDependencies(dependencies);
    writeLockFile(resolvedDeps);
    const diff = await this.diffLocal(resolvedDeps);
    const results = await this.createInstallTask(diff);
    // console.log({ results });
    Logger.stopStopWatch(sw);
    process.exit(0);
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
   * @returns {Promise<VersionInfo[]>}
   */
  private async resolveDependencies(dependencies: Dependency[]): Promise<VersionInfo[]> {
    const items = (
      await Promise.all(
        dependencies.map(d => getMinIncompatibleSet(d, this.options['no-cache']))
      )
    ).flat(1);
    const resolved = await resolveDependencies(items, [], this.options['no-cache']);

    return resolved;
  }
  
  private async diffLocal(dependencies: VersionInfo[]): Promise<VersionInfo[]> {
    // TODO:
    return dependencies;
  }

  private async createInstallTask(modules: VersionInfo[]) {
    Logger.info(
      chalk`🧱 {yellow.bold ${modules.length} }modules will be installed `
    );

    await batchDownload(modules);

    return;
  }

}
