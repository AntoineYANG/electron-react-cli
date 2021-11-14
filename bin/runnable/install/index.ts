/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:00:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:15:23
 */

import { ExitCode } from '../..';
import Runnable from '..';
import { Dependency, DependencyTag, getAllDependencies } from './utils/read-deps';
import env, { PackageJSON } from '../../utils/env';
import { getMinIncompatibleSet, resolveDependencies } from './utils/resolve-deps';
import { VersionInfo } from '../../utils/request/request-npm';
import { writeLockFile } from './utils/lock';
import Logger from '../../utils/ui/logger';


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
    if (this.params.length === 0) {
      await this.installAll();
    } else {
      // TODO: others
    }
    
    return ExitCode.OPERATION_NOT_FOUND;
  }

  private async installAll() {
    const NAME = 'Install local dependencies';
    const sw = Logger.startStopWatch(NAME);
    const dependencies = this.loadDependencies();
    const resolvedDeps = await this.resolveDependencies(dependencies);
    writeLockFile(resolvedDeps);
    Logger.stopStopWatch(sw);
    process.exit(0);
    const diff = this.diffLocal(dependencies);
    // await this.createInstallTask(modules);
    throw new Error('Method is not implemented');
  }

  /**
   * Loads all the explicit dependencies from all `package.json`.
   */
  private loadDependencies(): Dependency[] {
    // load all `package.json`
    const packages = [
      env.rootPkg,
      ...env.packages.map(p => env.packageMap[p] as PackageJSON)
    ];

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
  
  private async diffLocal(dependencies: Dependency[]): Promise<any> {
    throw new Error('Method is not implemented');
  }

  private async createInstallTask(modules: any) {
    await this.hoistDependencies(modules);
    throw new Error('Method is not implemented')
  }

  private async hoistDependencies(modules: any) {
    throw new Error('Method is not implemented')
  }

}
