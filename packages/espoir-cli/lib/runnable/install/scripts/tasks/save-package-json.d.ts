import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
interface Context {
    dependencies: SingleDependency[];
    lockData: LockData;
}
declare const savePackageJSON: <T extends Context>(scopes: string[], tag: 'dependencies' | 'devDependencies') => ListrTask<T, typeof DefaultRenderer>;
export default savePackageJSON;
