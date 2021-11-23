import { PackageAuthor, PackageJSON } from '@env';
import { RequestOptions } from '.';
import { LockInfo } from '@@install/utils/lock';
export declare type VersionInfo = PackageJSON & {
    name: string;
    version: string;
    gitHead: string;
    _id: string;
    _nodeVersion: string;
    _npmVersion: string;
    dist: {
        integrity: `${'sha256' | 'sha384' | 'sha512'}-${string}`;
        shasum: string;
        tarball: string;
        fileCount?: number;
        size?: number;
        unpackedSize?: number;
    };
    _npmUser: PackageAuthor;
    directories: {};
    maintainers?: PackageAuthor[];
    _npmOperationalInternal: {
        host: string;
        tmp: string;
    };
    _hasShrinkwrap: false;
} & {
    lockInfo?: LockInfo;
};
export declare type NpmPackage = {
    _id: string;
    _rev: string;
    name: string;
    'dist-tags': {
        latest: string;
        [ts: `ts${number}.${number}`]: string;
    };
    versions: {
        [version: string]: VersionInfo;
    };
    time: {
        created: string;
        modified: string;
        [version: string]: string;
    };
    maintainers: PackageAuthor[];
    author: PackageAuthor;
    license: string;
    readme: string;
    readmeFilename: string;
};
export declare type NpmPackageSingle = PackageJSON & {
    name: string;
    version: string;
    types?: string;
    typesPublisherContentHash?: string;
    typeScriptVersion?: `${number}.${number}`;
    _id: string;
    dist: {
        integrity?: string;
        shasum: string;
        tarball: string;
        noattachment?: boolean;
        fileCount?: number;
        size?: number;
        unpackedSize?: number;
    };
    _npmUser?: PackageAuthor;
    directories?: {};
    _npmOperationalInternal?: {
        host: string;
        tmp: string;
    };
    _hasShrinkwrap: boolean;
    publish_time: number;
    _cnpm_publish_time: number;
    'dist-tags': {
        latest: string;
        [ts: `ts${number}.${number}`]: string;
    };
    readme: string;
};
export declare type DownloadInfo = {
    name: string;
    version: string;
    path: string;
};
export declare type InstallOptions = {
    isProd: boolean;
    where: string;
    shell: 'cmd' | 'sh';
    args: string[];
    configs: {
        registry: string;
        ignoreMissing: boolean;
    };
    node: {
        version: string;
    };
};
/**
 * Gets information of the package from npm registry.
 *
 * @param {string} name
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, NpmPackage]>)}
 */
export declare const view: (name: string, options?: Partial<RequestOptions> | undefined) => Promise<[Error, null] | [null, NpmPackage]>;
/**
 * Gets information of the certain version for the package from npm registry.
 *
 * @param {string} name
 * @param {string} version
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, NpmPackageSingle]>)}
 */
export declare const find: (name: string, version: string, options?: Partial<RequestOptions> | undefined) => Promise<[Error, null] | [null, NpmPackageSingle]>;
