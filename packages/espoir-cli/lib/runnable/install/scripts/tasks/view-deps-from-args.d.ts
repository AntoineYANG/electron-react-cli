import type { ListrTask, ListrRendererFactory } from 'listr2';
import { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { VersionInfo } from '@request/request-npm';
interface Context {
    dependencies: SingleDependency[];
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
}
/**
 * This action will parse an array of strings as dependencies and resolve their dependencies.
 * `Context.dependencies`, `Context.lockData` and `Context.resolvedDeps` will be assigned.
 *
 * @template T context type
 * @param {string[]} modules
 * @returns {ListrTask<T, ListrRendererFactory>}
 */
declare const viewDepsFromArgs: <T extends Context>(modules: string[]) => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default viewDepsFromArgs;
