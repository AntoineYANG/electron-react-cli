import { DependencySet, DependencyTag } from '@@install/utils/load-dependencies';
export declare type PackageAuthor = string | Partial<{
    name: string;
    email: string;
    url: string;
}>;
export declare type PackageJSON = Partial<{
    name: string;
    version: string;
    private: boolean;
    workspaces: string[];
    author: PackageAuthor;
    contributors: PackageAuthor[];
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
export declare type EnvConfigs = {
    cacheDir: string;
};
declare const env: {
    rootDir: string;
    rootPkg: Partial<{
        [otherConfig: string]: any;
        name: string;
        version: string;
        private: boolean;
        workspaces: string[];
        author: PackageAuthor;
        contributors: PackageAuthor[];
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
    } & Record<DependencyTag, DependencySet>>;
    packages: string[];
    packageMap: {
        [k: string]: Partial<{
            [otherConfig: string]: any;
            name: string;
            version: string;
            private: boolean;
            workspaces: string[];
            author: PackageAuthor;
            contributors: PackageAuthor[];
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
        } & Record<DependencyTag, DependencySet>>;
    };
    currentPackage: string | undefined;
    resolvePath: (...pathSegments: string[]) => string;
    resolvePathInPackage: (packageName: string, ...pathSegments: string[]) => string;
    runtime: {
        shell: string;
        espoir: {
            name: string;
            version: string;
        };
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
