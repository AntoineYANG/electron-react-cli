import type { ListrTask, ListrRendererFactory } from 'listr2';
import { LockData } from '@@install/utils/lock';
interface Context {
    lockData: LockData;
}
declare const updatePackage: <T extends Context>(modules: string[], packages: string[], updateLock: boolean) => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default updatePackage;
