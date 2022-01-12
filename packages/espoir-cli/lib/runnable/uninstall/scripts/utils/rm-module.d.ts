import type { LockData } from '@@install/utils/lock';
import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { Requirement } from './analyse-requirements';
declare const rmModules: (lockData: LockData, requirements: Requirement[], from: string | null, modules: SingleDependency[]) => {
    lockData: LockData;
    requirements: Requirement[];
    deleted: string[];
};
export default rmModules;
