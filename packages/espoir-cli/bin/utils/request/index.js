"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 18:13:35
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-17 21:03:30
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestError = exports.StatusCode = void 0;

const fs = require("fs");

const path = require("path");

const mkdirp_1 = require("mkdirp");

const needle = require("needle");

const npm = require("./request-npm");

var StatusCode;

(function (StatusCode) {
  StatusCode[StatusCode["ok"] = 200] = "ok";
  StatusCode[StatusCode["redirected"] = 302] = "redirected";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));

const defaultOptions = {
  memo: false,
  cache: false,
  expiresSpan: 1_000 * 60 * 60 * 24,
  timeout: 5_000,
  maxRedirect: 1
};
const MAX_SYNC_SIZE = 2;
let nowRunning = 0;
const blockedRequests = [];

class RequestError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'RequestError';
  }

}

exports.RequestError = RequestError;

const runOrWait = async () => {
  if (nowRunning < MAX_SYNC_SIZE) {
    nowRunning += 1;
    return;
  }

  await new Promise(resolve => {
    blockedRequests.push(resolve);
  });
};

const next = () => {
  const req = blockedRequests.shift();

  if (req) {
    req();
  } else {
    nowRunning -= 1;
  }
};
/**
 * Sends a GET request.
 *
 * @template RT type of the expected return value
 * @param {string} url
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, RT]>)}
 */


const get = async (url, options, filter) => {
  const actualOptions = { ...defaultOptions,
    ...options
  };
  await runOrWait();
  const [err, resp] = await new Promise(resolve => {
    needle('get', url, {
      timeout: actualOptions.timeout
    }).then(({
      statusCode,
      ...resp
    }) => {
      switch (statusCode) {
        case StatusCode.ok:
          {
            const {
              body
            } = resp;

            if (filter) {
              return resolve([null, filter(body)]);
            }

            return resolve([null, body]);
          }

        case StatusCode.redirected:
          {
            if (actualOptions.maxRedirect) {
              const redirectUrl = resp.rawHeaders[resp.rawHeaders.indexOf('Location') + 1];
              return resolve(get(redirectUrl, { ...actualOptions,
                maxRedirect: actualOptions.maxRedirect - 1
              }));
            }

            return resolve([new RequestError('GET request reached maximum redirect times'), null]);
          }

        default:
          {
            return resolve([new RequestError(`[${statusCode}] Error occurred when requesting "${url}": ${JSON.stringify(resp.body)}.`), null]);
          }
      }
    }).catch(reason => {
      return [reason, null];
    });
  });
  next();
  return [err, resp];
};

const getRedirectedLocation = async (url, options) => {
  const actualOptions = { ...defaultOptions,
    ...options
  };
  const [err, resp] = await new Promise(resolve => {
    needle('get', url, {
      timeout: actualOptions.timeout
    }).then(({
      statusCode,
      ...resp
    }) => {
      switch (statusCode) {
        case StatusCode.redirected:
          {
            const redirectUrl = resp.rawHeaders[resp.rawHeaders.indexOf('Location') + 1];
            return resolve([null, redirectUrl]);
          }

        default:
          {
            return resolve([null, null]);
          }
      }
    }).catch(reason => {
      return [reason, null];
    });
  });
  return [err, resp];
};
/**
 * Downloads a file using GET request.
 *
 * @param {string} url
 * @param {string} output
 * @param {Partial<RequestOptions>} [options]
 * @param {(done: number, total: number) => void} [onProgress]
 * @returns {(Promise<[Error, null] | [null, number]>)}
 */


const download = async (url, output, options, onProgress) => {
  const actualOptions = { ...defaultOptions,
    ...options
  };
  const dir = path.resolve(output, '..');

  if (fs.existsSync(output)) {
    fs.rmSync(output);
  } else if (!fs.existsSync(dir)) {
    (0, mkdirp_1.sync)(dir);
  }

  const location = (await getRedirectedLocation(url, options))[1] ?? url;
  const ws = fs.createWriteStream(output);
  let pipedSize = 0;
  let totalSize = undefined;
  await runOrWait();
  const [err, size] = await new Promise(resolve => {
    needle.get(location, {
      timeout: actualOptions.timeout
    }).on('readable', function () {
      while (true) {
        const header = this.request.res.rawHeaders;
        const idx = header.indexOf('Content-Length');

        if (idx !== -1 && header[idx + 1]) {
          totalSize = parseInt(header[idx + 1], 10);
        }

        const data = this.read();

        if (!data) {
          break;
        }

        ws.write(data);
        const size = Buffer.from(data).byteLength;
        pipedSize += size;

        if (onProgress) {
          onProgress(pipedSize, totalSize);
        }
      }
    }).on('done', err => {
      ws.end();

      if (err) {
        return resolve([err, null]);
      } else {
        return resolve([null, pipedSize]);
      }
    });
  });
  next();
  return [err, size];
};

const request = {
  get,
  download,
  npm
};
exports.default = request;