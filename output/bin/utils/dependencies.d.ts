export declare type DependenciesInfo = {
    name: string;
    flag?: 'dev' | 'peer';
    version?: string;
};
export declare const installAll: (path: string, deps: DependenciesInfo[]) => void;
