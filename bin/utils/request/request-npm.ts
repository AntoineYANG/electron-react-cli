/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 18:34:47 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:12:47
 */

import env, { PackageAuthor, PackageJSON } from '../../utils/env';
import request, { RequestOptions } from '.';


export type VersionInfo = PackageJSON & {
  name: string;
  version: string;
  gitHead: string;
  _id: string; // '{name}@{version}'
  _nodeVersion: string;
  _npmVersion: string;
  dist: {
    integrity: `${'sha256'|'sha384'|'sha512'}-${string}`;
    shasum: string;
    tarball: `${string}/${string}/-/${string}-${string}.tgz`; // 'https://registry.npmjs.org/{name}/-/{name}-{version}.tgz'
    fileCount: number;
    unpackedSize: number;
  };
  _npmUser: PackageAuthor;
  directories: {};
  maintainers?: PackageAuthor[];
  _npmOperationalInternal: {
    host: string; // 's3://npm-registry-packages'
    tmp: string; // 'tmp/{name}_{version}_<int>_<float>'
  };
  _hasShrinkwrap: false
};

export type NpmPackage = {
  _id: string;
  _rev: string;
  name: string;
  'dist-tags': {
    latest: string;
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
export const view = (
  name: string, options?: Partial<RequestOptions>
): Promise<[Error, null] | [null, NpmPackage]> => {
  return request.get<NpmPackage>(
    `${env.runtime.npm.registry}${name}`, {
      expiresSpan: 1_000 * 60 * 60 * 24 * 15,
      ...options,
      memo: false,
      cache: false
    }, np => {
      const versions = {} as NpmPackage['versions'];

      Object.entries(np.versions).forEach(([v, d]) => {
        versions[v] = {
          name: d.name,
          version: d.version,
          dist: {
            tarball: d.dist.tarball
          },
          dependencies: d.dependencies
        } as VersionInfo;
      });

      return {
        name: np.name,
        versions
      };
    }
  );
};
