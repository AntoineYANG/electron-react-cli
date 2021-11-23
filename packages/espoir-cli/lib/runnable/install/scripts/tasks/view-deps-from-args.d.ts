import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { VersionInfo } from '@request/request-npm';
declare const viewDepsFromArgs: <T extends {
    dependencies: SingleDependency[];
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
}>(modules: string[]) => ListrTask<T, typeof DefaultRenderer>;
export default viewDepsFromArgs;
