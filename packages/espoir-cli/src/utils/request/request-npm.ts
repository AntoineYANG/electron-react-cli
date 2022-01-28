/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 18:34:47 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:44:46
 */

import env, { PackageAuthor, PackageJSON } from '@env';
import request, { RequestOptions } from './index';
import { LockInfo } from '@@install/utils/lock';


export type VersionInfo = PackageJSON & {
  name: string;
  version: string;
  gitHead: string;
  _id: string; // '{name}@{version}'
  _nodeVersion: string;
  _npmVersion: string;
  dist: {
    integrity: '<local>' | `${'sha256'|'sha384'|'sha512'}-${string}`;
    shasum: string;
    tarball: string; // 'https://registry.npmjs.org/{name}/-/{name}-{version}.tgz'
    fileCount?: number;
    size?: number;
    unpackedSize?: number;
  };
  _npmUser: PackageAuthor;
  directories: {};
  maintainers?: PackageAuthor[];
  _npmOperationalInternal: {
    host: string; // 's3://npm-registry-packages'
    tmp: string; // 'tmp/{name}_{version}_<int>_<float>'
  };
  _hasShrinkwrap: false;
} & {
  lockInfo?: LockInfo;
};

export type NpmPackage = {
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

export type NpmPackageSingle = PackageJSON & {
  name: string;
  version: string;
  types?: string;
  typesPublisherContentHash?: string;
  typeScriptVersion?: `${number}.${number}`;
  _id: string;
  dist: {
    integrity?: string;
    shasum: string;
    tarball: string; // 'https://registry.npmjs.org/{name}/-/{name}-{version}.tgz'
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

export type DownloadInfo = {
  name: string;
  version: string;
  path: string;
};

export type InstallOptions = {
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
export const view = async (
  name: string, options?: Partial<RequestOptions>
): Promise<[Error, null] | [null, NpmPackage]> => {
  const [err, data] = await request.get<NpmPackage>(
    `${env.runtime.npm.registry}${name}`, {
      expiresSpan: 1_000 * 60 * 60 * 24 * 15,
      ...options,
      memo: false,
      cache: false
    }, (np: NpmPackage) => {
      const versions = {} as NpmPackage['versions'];

      Object.entries(np.versions).forEach(([v, d]) => {
        versions[v] = {
          name: d.name,
          version: d.version,
          dist: {
            tarball: d.dist.tarball,
            size: d.dist.size,
            unpackedSize: d.dist.unpackedSize,
            integrity: d.dist.integrity
          },
          dependencies: d.dependencies
        } as VersionInfo;
      });

      return {
        name: np.name,
        'dist-tags': np['dist-tags'],
        versions
      };
    }
  );

  if (err?.name === 'RequestError' && err.message.startsWith('[404] ')) {
    return [
      new Error(`Cannot find module ${name}. `),
      null
    ];
  }

  return [err, data] as [Error, null] | [null, NpmPackage];
};


/**
 * Gets information of the certain version for the package from npm registry.
 *
 * @param {string} name
 * @param {string} version
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, NpmPackageSingle]>)}
 */
export const find = (
  name: string, version: string, options?: Partial<RequestOptions>
): Promise<[Error, null] | [null, NpmPackageSingle]> => {
  return request.get<NpmPackageSingle>(
    `${env.runtime.npm.registry}${name}/${version}`, {
      expiresSpan: 1_000 * 60 * 60 * 24 * 15,
      ...options,
      memo: false,
      cache: false
    }, (np: NpmPackageSingle) => {
      return {
        name: np.name,
        version: np.version,
        dependencies: np.dependencies,
        dist: {
          tarball: np.dist.tarball,
          unpackedSize: np.dist.unpackedSize,
          integrity: np.dist.integrity
        }
      } as NpmPackageSingle;
    }
  );
};
