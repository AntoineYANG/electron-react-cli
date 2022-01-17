import type { ListrTask, ListrRendererFactory } from 'listr2';
import type { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
interface Context {
    dependencies: SingleDependency[];
    lockData: LockData;
}
declare const savePackageJSON: <T extends Context>(scopes: string[], tag: 'dependencies' | 'devDependencies') => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default savePackageJSON;
