import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { InstallResult } from '@@install/utils/download-deps';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';
declare const createLinks: <T extends {
    dependencies: SingleDependency[];
    lockData: LockData;
    installResults: InstallResult[];
}>() => ListrTask<T, typeof DefaultRenderer>;
export default createLinks;
