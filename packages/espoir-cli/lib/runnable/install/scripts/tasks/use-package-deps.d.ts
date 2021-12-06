import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { SingleDependency } from '@@install/utils/load-dependencies';
import { LockData } from '@@install/utils/lock';
import { VersionInfo } from '@request/request-npm';
/**
 * Initialize `ctx.dependencies` by resolving dependencies in required packages.
 *
 * @template T
 * @param {string[]} scopes
 * @param {boolean} isProd
 * @returns {ListrTask<T, typeof DefaultRenderer>}
 */
declare const usePackageDeps: <T extends {
    dependencies: SingleDependency[];
    lockData: LockData;
    resolvedDeps: VersionInfo[];
}>(scopes: string[], isProd: boolean) => ListrTask<T, typeof DefaultRenderer>;
export default usePackageDeps;
