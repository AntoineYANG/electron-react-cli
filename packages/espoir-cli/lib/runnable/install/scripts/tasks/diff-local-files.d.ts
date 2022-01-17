import type { ListrTask, ListrRendererFactory } from 'listr2';
import { LockData } from '@@install/utils/lock';
import type { VersionInfo } from '@request/request-npm';
interface Context {
    resolvedDeps: VersionInfo[];
    diff: VersionInfo[];
    lockData: LockData;
}
declare const diffLocalFiles: <T extends Context>() => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default diffLocalFiles;
