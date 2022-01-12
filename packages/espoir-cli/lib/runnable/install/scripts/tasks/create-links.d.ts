import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { InstallResult } from '@@install/utils/download-deps';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';
interface Context {
    dependencies: SingleDependency[];
    lockData: LockData;
    installResults: InstallResult[];
}
declare const createLinks: <T extends Context>() => ListrTask<T, typeof DefaultRenderer>;
export default createLinks;
