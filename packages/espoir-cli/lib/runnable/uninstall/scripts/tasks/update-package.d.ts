import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
interface Context {
    lockData: LockData;
}
declare const updatePackage: <T extends Context>(modules: string[], packages: string[], updateLock: boolean) => ListrTask<T, typeof DefaultRenderer>;
export default updatePackage;
