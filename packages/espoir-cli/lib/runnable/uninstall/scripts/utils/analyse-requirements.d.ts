import type { SingleDependency } from '@@install/utils/load-dependencies';
import type { LockData } from '@@install/utils/lock';
export interface Requirement {
    module: SingleDependency;
    location: string;
    link?: string;
    packages: string[];
    required: string[];
    requiring: {
        [name: string]: string;
    };
}
declare const analyseRequirements: (lockData: LockData) => Requirement[];
export default analyseRequirements;
