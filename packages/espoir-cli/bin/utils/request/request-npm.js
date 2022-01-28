"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 18:34:47
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:44:46
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = exports.view = void 0;

const _env_1 = require("../env");

const index_1 = require("./index");
/**
 * Gets information of the package from npm registry.
 *
 * @param {string} name
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, NpmPackage]>)}
 */


const view = async (name, options) => {
  const [err, data] = await index_1.default.get(`${_env_1.default.runtime.npm.registry}${name}`, {
    expiresSpan: 1_000 * 60 * 60 * 24 * 15,
    ...options,
    memo: false,
    cache: false
  }, np => {
    const versions = {};
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
      };
    });
    return {
      name: np.name,
      'dist-tags': np['dist-tags'],
      versions
    };
  });

  if (err?.name === 'RequestError' && err.message.startsWith('[404] ')) {
    return [new Error(`Cannot find module ${name}. `), null];
  }

  return [err, data];
};

exports.view = view;
/**
 * Gets information of the certain version for the package from npm registry.
 *
 * @param {string} name
 * @param {string} version
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, NpmPackageSingle]>)}
 */

const find = (name, version, options) => {
  return index_1.default.get(`${_env_1.default.runtime.npm.registry}${name}/${version}`, {
    expiresSpan: 1_000 * 60 * 60 * 24 * 15,
    ...options,
    memo: false,
    cache: false
  }, np => {
    return {
      name: np.name,
      version: np.version,
      dependencies: np.dependencies,
      dist: {
        tarball: np.dist.tarball,
        unpackedSize: np.dist.unpackedSize,
        integrity: np.dist.integrity
      }
    };
  });
};

exports.find = find;