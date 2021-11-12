/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 20:00:53 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-13 02:18:27
 */

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp').sync;
const needle = require('needle');
const semver = require('semver');
const compressing = require('compressing');

const { progress } = require('./install-progress');


const TIMEOUT = 5_000;

/**
 * Downloads a .tgz file.
 * If it receives a 302 status, it will try one more time with the redirected location.
 *
 * @param {string} url download url
 * @param {string} p output file
 * @param {string|undefined} [redirectTo=undefined] redirected location
 * @returns {Promise<void>}
 */
const download = async (url, p, redirectTo = undefined) => {
  const needRedirect = await new Promise((_res, _rej) => {
    needle.get(
      redirectTo ?? url,
      {
        timeout: TIMEOUT,
        output:  p
      },
      (err, resp, body) => {
        /* eslint-disable no-magic-numbers */
        if (err) {
          _rej(err);
        } else if (resp.statusCode === 302 && !redirectTo) {
          const redirectUrl = resp.rawHeaders[
            resp.rawHeaders.indexOf('Location') + 1
          ];
          _res(redirectUrl);
        } else if (resp.statusCode !== 200) {
          _rej(
            new Error(
              `[${resp.statusCode}] at ${
                url
              } ${
                resp.statusMessage || 'Failed to download'
              }`
            )
          );
        } else {
          _res(false);
        }
        /* eslint-enable no-magic-numbers */
      }
    );
  });

  if (needRedirect) {
    await download(url, p, needRedirect);
  }

  return;
};

/**
 * Un-compresses a .tgz file, and delete it after done.
 *
 * @param {string} fn file name
 * @returns {Promise<void>}
 */
const unCompress = async fn => {
  const dir = path.resolve(fn, '..');

  await compressing.tgz.uncompress(fn, dir);
  fs.rmSync(fn);
};

/**
 * Unpacks a downloaded package.
 *
 * @param {string} dir directory
 * @returns {void}
 */
const unPack = dir => {
  const pp = path.join(dir, 'package');

  if (!fs.existsSync(pp)) {
    // exclude those who does not have a /package directory, e.g.: @type/*
    return;
  }
  
  const files = fs.readdirSync(pp);

  files.forEach(fn => {
    const _from = path.join(dir, 'package', fn);
    const _to = path.join(dir, fn);
    fs.renameSync(_from, _to);
  });

  fs.rmdirSync(pp);
};

/**
 * Downloads a package.
 *
 * @param {import('../../scripts/node-package').VersionInfo} data info of the version
 * @param {string} root target directory
 * @returns {Promise<import('../../scripts/node-package').DownloadInfo>}
 */
const downloadPackage = (data, root) => new Promise((resolve, reject) => {
  const { name } = data;
  const dir = path.join(
    root,
    name,
    semver.valid(semver.coerce(data.version)).replace(/\./g, '_')
  );
  const url = data.dist.tarball;
  const [fn] = url.split(/\/+/).reverse();
  const p = path.join(dir, fn);
  
  if (fs.existsSync(dir)) {
    fs.rmSync(
      dir,
      {
        recursive: true,
        force:     true
      }
    );
  }
    
  mkdirp(dir);

  try {
    progress(name, 'download', 0).then(
      // download
      () => download(url, p)
    ).then(
      () => progress(name, 'download', 1)
    ).then(
      // compress
      () => progress(name, 'un-compress', 0)
    ).then(
      () => unCompress(p)
    ).then(
      () => progress(name, 'un-compress', 1)
    ).then(
      // unpack
      () => progress(name, 'unpack', 0)
    ).then(
      () => unPack(dir)
    ).then(
      () => progress(name, 'unpack', 1)
    ).then(
      () => progress(name, 'done', 1)
    ).then(
      // resolve
      () => {
        resolve({
          name,
          version: data.version,
          path:    p
        });
      }
    );
  } catch (error) {
    if (fs.existsSync(dir)) {
      fs.rmSync(
        dir,
        {
          recursive: true,
          force:     true
        }
      );
    }

    progress(name, 'failed', 0).finally(() => {
      reject(error);
    });
  }
});

/**
 * Returns available versions of a module.
 * Results is sorted by version in descending order.
 *
 * @param {string} name name of the module
 * @param {string} version semver range
 * @param {import('../../scripts/node-package').InstallOptions} options install options
 * @returns {Promise<import('../../scripts/node-package').VersionInfo[]>}
 */
const getAvailableVersions = (name, version, options) => new Promise((resolve, reject) => {
  needle(
    'get',
    `${options.configs.registry}${name}`,
    {
      timeout: TIMEOUT
    }
  ).then(({ statusCode, ...resp }) => {
    switch (statusCode) {
      // eslint-disable-next-line no-magic-numbers
      case 200: {
        /** @type {import('../../scripts/node-package').NodePackage} */
        const { body } = resp;
        /** @type {import('../../scripts/node-package').VersionInfo[]} */
        const versions = [];
        Object.entries(body.versions).forEach(([v, d]) => {
          if (!d.dist?.tarball) {
            // unable to download
            return;
          }
          if (semver.satisfies(v, version)) {
            versions.push(d);
          }
        });
        return resolve(
          versions.sort((a, b) => (semver.lt(a.version, b.version) ? 1 : -1))
        );
      }

      default: {
        // version not found
        return reject(
          new Error(`[${statusCode}] ${resp.body}.`)
        );
      }
    }
  }).catch(reject);
});


module.exports = {
  downloadPackage,
  getAvailableVersions
};
