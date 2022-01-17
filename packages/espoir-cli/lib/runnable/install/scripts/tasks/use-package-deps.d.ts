import type { ListrTask, ListrRendererFactory } from 'listr2';
import { SingleDependency } from '@@install/utils/load-dependencies';
import { LockData } from '@@install/utils/lock';
import { VersionInfo } from '@request/request-npm';
interface Context {
    dependencies: SingleDependency[];
    lockData: LockData;
    resolvedDeps: VersionInfo[];
}
/**
 * Initialize `ctx.dependencies` by resolving dependencies in required packages.
 *
 * @template T
 * @param {string[]} scopes
 * @param {boolean} isProd
 * @returns {ListrTask<T, ListrRendererFactory>}
 */
declare const usePackageDeps: <T extends Context>(scopes: string[], isProd: boolean) => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default usePackageDeps;
