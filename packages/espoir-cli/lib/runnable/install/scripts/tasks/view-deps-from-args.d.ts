import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { VersionInfo } from '@request/request-npm';
/**
 * This action will parse an array of strings as dependencies and resolve their dependencies.
 * `Context.dependencies`, `Context.lockData` and `Context.resolvedDeps` will be assigned.
 *
 * @template T context type
 * @param {string[]} modules
 * @returns {ListrTask<T, typeof DefaultRenderer>}
 */
declare const viewDepsFromArgs: <T extends {
    dependencies: SingleDependency[];
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
}>(modules: string[]) => ListrTask<T, typeof DefaultRenderer>;
export default viewDepsFromArgs;
