import { DependencySet, DependencyTag } from '@@install/utils/load-dependencies';
import { lazyUpdate } from '@lazy';
export declare type PackageAuthor = string | Partial<{
    name: string;
    email: string;
    url: string;
}>;
export declare type PackageJSON = Partial<{
    name: string;
    version: string;
    private: boolean;
    espoirVersion: number;
    espoirPackage: 'module' | 'package';
    workspaces: string[];
    author: PackageAuthor;
    contributors: PackageAuthor[];
    repository: {
        type: 'git';
        url: string;
        directory: string;
    };
    bugs: {
        url: string;
    };
    homepage: string;
    bin: string | {
        [name: string]: string;
    };
    scripts: {
        [script: string]: string;
    };
    license: string;
    peerDependenciesMeta: Record<string, {
        optional: boolean;
    }>;
    [otherConfig: string]: any;
} & Record<DependencyTag, DependencySet>>;
export declare type EspoirCommitConfigs = {
    /** Types allowed to use */
    types: string[];
    /** Whether this commit can be run without changelog or not */
    optional: boolean;
    /** Valid format of commit message */
    format: string;
    /** Scopes allowed to use */
    scopes?: string[];
    /** Configurations of commit message subject */
    subject: {
        /** Minimum string length */
        min: number;
        /** Maximum string length */
        max: number;
        /** Valid pattern */
        pattern: RegExp;
    };
};
export declare type EspoirConfigs = {
    cacheDir: string;
    /** Configuration of espoir contribute feature */
    commit: EspoirCommitConfigs;
};
export declare type EspoirEnv = Readonly<{
    /** major version of espoir-cli */
    version: number;
    /** absolute directory of the current monorepo */
    rootDir: string | null;
    /** data of package.json of the current monorepo */
    rootPkg: PackageJSON | null;
    /** names of all the packages in the current monorepo */
    packages: string[] | null;
    /** map of data of package.json for each package in the current monorepo */
    packageMap: Record<string, PackageJSON> | null;
    /** name of the current package */
    currentPackage: string | null;
    /** resolves an absolute path from a relative directory in the monorepo */
    resolvePath: (...pathSegments: string[]) => string;
    /** resolves an absolute path from a relative directory in a package */
    resolvePathInPackage: (...pathSegments: string[]) => string;
    /** runtime parameters */
    runtime: {
        /** name of the shell of the system */
        shell: string;
        /** espoir runtime */
        espoir: {
            /** name of espoir-cli */
            name: string;
            /** version string of espoir-cli */
            version: string;
            /** README.md link at github */
            github: string;
        };
        /** npm runtime */
        npm: {
            /** registry configuration */
            registry: string;
        };
        /** node runtime */
        node: {
            /** node version */
            version: string;
        };
    };
    /** espoir configuration */
    configs: EspoirConfigs;
}>;
declare const env: Readonly<{
    /** major version of espoir-cli */
    version: number;
    /** absolute directory of the current monorepo */
    rootDir: string | null;
    /** data of package.json of the current monorepo */
    rootPkg: PackageJSON | null;
    /** names of all the packages in the current monorepo */
    packages: string[] | null;
    /** map of data of package.json for each package in the current monorepo */
    packageMap: Record<string, PackageJSON> | null;
    /** name of the current package */
    currentPackage: string | null;
    /** resolves an absolute path from a relative directory in the monorepo */
    resolvePath: (...pathSegments: string[]) => string;
    /** resolves an absolute path from a relative directory in a package */
    resolvePathInPackage: (...pathSegments: string[]) => string;
    /** runtime parameters */
    runtime: {
        /** name of the shell of the system */
        shell: string;
        /** espoir runtime */
        espoir: {
            /** name of espoir-cli */
            name: string;
            /** version string of espoir-cli */
            version: string;
            /** README.md link at github */
            github: string;
        };
        /** npm runtime */
        npm: {
            /** registry configuration */
            registry: string;
        };
        /** node runtime */
        node: {
            /** node version */
            version: string;
        };
    };
    /** espoir configuration */
    configs: EspoirConfigs;
}> & {
    [lazyUpdate]: (keys: (keyof EspoirEnv)[]) => void;
};
export default env;
