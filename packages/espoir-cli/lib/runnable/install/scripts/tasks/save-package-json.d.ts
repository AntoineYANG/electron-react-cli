import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
declare const savePackageJSON: <T extends {
    dependencies: SingleDependency[];
    lockData: LockData;
}>(scopes: string[], tag: 'dependencies' | 'devDependencies') => ListrTask<T, typeof DefaultRenderer>;
export default savePackageJSON;
