import { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
interface Context {
    lockData: LockData;
}
declare const saveLockFile: <T extends Context>() => ListrTask<T, typeof DefaultRenderer>;
export default saveLockFile;
