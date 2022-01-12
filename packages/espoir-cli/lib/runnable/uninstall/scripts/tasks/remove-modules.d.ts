import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { LockData } from '@@install/utils/lock';
import type { Requirement } from '@@uninstall/scripts/utils/analyse-requirements';
interface Context {
    lockData: LockData;
    requirements: Requirement[];
    removed: string[];
}
declare const removeModules: <T extends Context>(modules: string[], packages: string[]) => ListrTask<T, typeof DefaultRenderer>;
export default removeModules;
