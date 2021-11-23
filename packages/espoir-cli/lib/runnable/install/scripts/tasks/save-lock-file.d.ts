import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
declare const saveLockFile: <T extends {
    lockData: LockData;
}>() => ListrTask<T, typeof DefaultRenderer>;
export default saveLockFile;
