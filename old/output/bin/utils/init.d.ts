export declare type PackageConfig = {
    name: string;
    description?: string;
    keywords?: string[];
    version: string;
    license?: string;
    author?: string;
    git?: string;
};
export declare type TSConfig = {
    target: `ES${3 | 5 | 6 | `20${15 | 16 | 17 | 18 | 19 | 20 | 21}` | 'Next'}`;
    allowJS: boolean;
    module: 'AMD' | 'CommonJS' | 'esnext' | 'UMD' | 'ES6';
    emit: boolean;
};
export declare type ProjectConfigs = {
    package: PackageConfig;
    mode: 'react' | 'nodejs';
    typescript?: TSConfig;
    sass: boolean;
    eslint: boolean;
};
declare const initProject: (path: string, configs: ProjectConfigs) => Promise<void>;
export default initProject;
