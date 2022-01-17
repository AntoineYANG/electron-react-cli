import type { ListrTask, ListrRendererFactory } from 'listr2';
import type { InstallResult } from '@@install/utils/download-deps';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';
interface Context {
    dependencies: SingleDependency[];
    lockData: LockData;
    installResults: InstallResult[];
}
declare const createLinks: <T extends Context>() => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default createLinks;
