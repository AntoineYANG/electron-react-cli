/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 18:13:35 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 01:23:52
 */

import * as fs from 'fs';
import * as path from 'path';
import { sync as mkdirp } from 'mkdirp';
import * as needle from 'needle';
import type { PassThrough } from 'stream';
import type { ClientRequest, IncomingMessage } from 'http';

import * as npm from './request-npm';


export enum StatusCode {
  ok = 200,
  redirected = 302,
}

export interface RequestOptions {
  /** If enabled, the response of each url will be cached during the lifetime of the process. (default = false) */
  memo: boolean;
  /** If enabled, the response of each url will be cached as file. (default = false) */
  cache: boolean;
  /** set how long (ms) will the cached information expire. */
  expiresSpan: number;
  timeout: number;
  maxRedirect: number;
}

const defaultOptions: RequestOptions = {
  memo: false,
  cache: false,
  expiresSpan: 1_000 * 60 * 60 * 24,
  timeout: 5_000,
  maxRedirect: 1
};

export class RequestError extends Error {

  constructor(msg: string) {
    super(msg);
    this.name = 'RequestError';
  }

}

/**
 * Sends a GET request.
 *
 * @template RT type of the expected return value
 * @param {string} url
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, RT]>)}
 */
const get = async <RT>(
  url: string, options?: Partial<RequestOptions>, filter?: (data: RT) => Partial<RT>
): Promise<[Error, null] | [null, RT]> => {
  const actualOptions = {
    ...defaultOptions,
    ...options
  };

  const [err, resp] = await new Promise<[RequestError, null] | [null, RT]>(resolve => {
    needle(
      'get',
      url,
      {
        timeout: actualOptions.timeout
      }
    ).then(({ statusCode, ...resp }) => {
      switch (statusCode) {
        case StatusCode.ok: {
          const { body } = resp;

          if (filter) {
            return resolve([null, filter(body as RT) as RT]);
          }

          return resolve([null, body]);
        }

        case StatusCode.redirected: {
          if (actualOptions.maxRedirect) {
            const redirectUrl = resp.rawHeaders[
              resp.rawHeaders.indexOf('Location') + 1
            ] as string;

            return resolve(
              get<RT>(
                redirectUrl, {
                  ...actualOptions,
                  maxRedirect: actualOptions.maxRedirect - 1
                }
              )
            );
          }

          return resolve([
            new RequestError('GET request reached maximum redirect times'),
            null
          ]);
        }

        default: {
          return resolve([
            new RequestError(`[${statusCode}] ${resp.body}.`),
            null
          ]);
        }
      }
    }).catch(reason => {
      return [reason as Error, null];
    });
  });
  
  return [err, resp] as [RequestError, null] | [null, RT];
};

const getRedirectedLocation = async (
  url: string, options?: Partial<RequestOptions>
): Promise<[Error, null] | [null, string | null]> => {
  const actualOptions = {
    ...defaultOptions,
    ...options
  };

  const [err, resp] = await new Promise<[RequestError, null] | [null, string | null]>(resolve => {
    needle(
      'get',
      url,
      {
        timeout: actualOptions.timeout
      }
    ).then(({ statusCode, ...resp }) => {
      switch (statusCode) {
        case StatusCode.redirected: {
          const redirectUrl = resp.rawHeaders[
            resp.rawHeaders.indexOf('Location') + 1
          ] as string;

          return resolve([null, redirectUrl]);
        }

        default: {
          return resolve([null, null]);
        }
      }
    }).catch(reason => {
      return [reason as Error, null];
    });
  });
  
  return [err, resp] as [RequestError, null] | [null, string | null];
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
const download = async (
  url: string,
  output: string,
  options?: Partial<RequestOptions>,
  onProgress?: (done: number, total: number | undefined) => void
): Promise<[Error, null] | [null, number]> => {
  const actualOptions = {
    ...defaultOptions,
    ...options
  };

  const dir = path.resolve(output, '..');

  if (fs.existsSync(output)) {
    fs.rmSync(output);
  } else if (!fs.existsSync(dir)) {
    mkdirp(dir);
  }

  const location = (await getRedirectedLocation(url, options))[1] ?? url;

  const ws = fs.createWriteStream(output);

  let pipedSize = 0;
  let totalSize: number | undefined = undefined;

  const [err, size] = await new Promise<[RequestError, null] | [null, number]>(resolve => {
    needle.get(
      location,
      {
        timeout: actualOptions.timeout
      }
    ).on('readable', function (this: PassThrough & { request: ClientRequest & { res: IncomingMessage } }) {
      while (true) {
        const header = this.request.res.rawHeaders;
        const idx = header.indexOf('Content-Length');

        if (idx !== -1 && header[idx + 1]) {
          totalSize = parseInt(header[idx + 1] as string, 10);
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
    }).on('done', (err: Error) => {
      ws.end();

      if (err) {
        return resolve([err, null]);
      } else {
        return resolve([null, pipedSize]);
      }
    });
  });
  
  return [err, size] as [RequestError, null] | [null, number];
};

const request = {
  get,
  download,
  npm
};


export default request;
