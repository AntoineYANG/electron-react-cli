import type { ListrTask, ListrRendererFactory } from 'listr2';
import { LockData } from '@@install/utils/lock';
interface Context {
    lockData: LockData;
}
declare const saveLockFile: <T extends Context>() => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default saveLockFile;
