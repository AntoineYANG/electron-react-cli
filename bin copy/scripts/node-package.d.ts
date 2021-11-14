/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 19:39:05 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-13 23:31:49
 */

export type NodePackageAuthor = string | {
  name: string;
  email?: string;
  url?: string;
};

export type VersionInfo = {
  name: string;
  version: string;
  description?: string;
  author?: NodePackageAuthor;
  license?: string;
  scripts?: {
    [script: string]: string;
  };
  dependencies?: {
    [name: string]: string;
  };
  devDependencies?: {
    [name: string]: string;
  };
  gitHead: string;
  _id: string; // '{name}@{version}'
  _nodeVersion: string;
  _npmVersion: string;
  dist: {
    integrity: `sha512-${string}==`;
    shasum: string;
    tarball: `${string}/${string}/-/${string}-${string}.tgz`; // 'https://registry.npmjs.org/{name}/-/{name}-{version}.tgz'
    fileCount: number;
    unpackedSize: number;
  };
  _npmUser: NodePackageAuthor;
  directories: {};
  maintainers?: NodePackageAuthor[];
  _npmOperationalInternal: {
    host: string; // 's3://npm-registry-packages'
    tmp: string; // 'tmp/{name}_{version}_1636434094108_0.7994044382549281'
  };
  _hasShrinkwrap: false
};

export type NodePackage = {
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
  maintainers: NodePackageAuthor[];
  author: NodePackageAuthor;
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
