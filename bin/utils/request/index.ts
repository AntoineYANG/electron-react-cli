/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 18:13:35 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 23:59:14
 */

import * as needle from 'needle';
import * as npm from './request-npm';

import {
  memoize,
  useLocalCache,
  useMemoized,
  writeLocalCache
} from './cache';


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

  if (actualOptions.memo) {
    const memoized = useMemoized<RT>(url);

    if (memoized) {
      return Promise.resolve([null, memoized]);
    }
  }

  if (actualOptions.cache) {
    const cached = useLocalCache<RT>(url);

    if (cached) {
      return Promise.resolve([null, cached]);
    }
  }

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
  
  if (resp) {
    if (actualOptions.memo) {
      memoize(url, resp, filter ?? ((d: RT) => d));
    }
    if (actualOptions.cache) {
      writeLocalCache(url, resp, actualOptions.expiresSpan, filter ?? ((d: RT) => d));
    }
  }
  
  return [err, resp] as [RequestError, null] | [null, RT];
};


const request = {
  get,
  npm
};


export default request;
