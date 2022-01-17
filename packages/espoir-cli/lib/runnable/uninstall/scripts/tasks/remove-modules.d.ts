import type { ListrTask, ListrRendererFactory } from 'listr2';
import { LockData } from '@@install/utils/lock';
import type { Requirement } from '@@uninstall/scripts/utils/analyse-requirements';
interface Context {
    lockData: LockData;
    requirements: Requirement[];
    removed: string[];
}
declare const removeModules: <T extends Context>(modules: string[], packages: string[]) => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default removeModules;
