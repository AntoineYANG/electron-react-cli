import { SingleDependency } from './load-dependencies';
export declare type CliLink = {
    name: string;
    path: string;
};
declare const linkCLI: (dependencies: SingleDependency[]) => CliLink[];
export declare const writeLinks: (links: CliLink[]) => void;
export default linkCLI;
