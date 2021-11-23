import * as npm from './request-npm';
export declare enum StatusCode {
    ok = 200,
    redirected = 302
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
export declare class RequestError extends Error {
    constructor(msg: string);
}
declare const request: {
    get: <RT>(url: string, options?: Partial<RequestOptions> | undefined, filter?: ((data: RT) => Partial<RT>) | undefined) => Promise<[Error, null] | [null, RT]>;
    download: (url: string, output: string, options?: Partial<RequestOptions> | undefined, onProgress?: ((done: number, total: number | undefined) => void) | undefined) => Promise<[Error, null] | [null, number]>;
    npm: typeof npm;
};
export default request;
