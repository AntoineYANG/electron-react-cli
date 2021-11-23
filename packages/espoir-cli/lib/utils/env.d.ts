import { DependencySet, DependencyTag } from '@@install/utils/load-dependencies';
export declare type PackageAuthor = string | Partial<{
    name: string;
    email: string;
    url: string;
}>;
export declare type PackageJSON = Partial<{
    private: boolean;
    workspaces: string[];
    author: PackageAuthor;
    contributors: PackageAuthor[];
    scripts: {
        [script: string]: string;
    };
    license: string;
    [otherConfig: string]: any;
} & Record<DependencyTag, DependencySet>>;
export declare type EnvConfigs = {
    cacheDir: string;
};
declare const env: {
    rootDir: string;
    rootPkg: Partial<{
        [otherConfig: string]: any;
        private: boolean;
        workspaces: string[];
        author: PackageAuthor;
        contributors: PackageAuthor[];
        scripts: {
            [script: string]: string;
        };
        license: string;
    } & Record<DependencyTag, DependencySet>>;
    packages: string[];
    packageMap: {
        [k: string]: Partial<{
            [otherConfig: string]: any;
            private: boolean;
            workspaces: string[];
            author: PackageAuthor;
            contributors: PackageAuthor[];
            scripts: {
                [script: string]: string;
            };
            license: string;
        } & Record<DependencyTag, DependencySet>>;
    };
    currentPackage: string | undefined;
    resolvePath: (...pathSegments: string[]) => string;
    resolvePathInPackage: (packageName: string, ...pathSegments: string[]) => string;
    runtime: {
        shell: string;
        npm: {
            registry: string;
        };
        node: {
            version: string;
        };
    };
    configs: Readonly<EnvConfigs>;
};
export default env;
