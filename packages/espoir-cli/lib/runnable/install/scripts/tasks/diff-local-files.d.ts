import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
import type { VersionInfo } from '@request/request-npm';
interface Context {
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
}
declare const diffLocalFiles: <T extends Context>() => ListrTask<T, typeof DefaultRenderer>;
export default diffLocalFiles;
