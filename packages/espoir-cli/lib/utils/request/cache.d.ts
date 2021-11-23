export declare type RequestCache = {
    url: string;
    resp: any;
    expiresTime: number;
};
export declare type RequestMemo = {
    url: string;
    resp: any;
};
export declare const writeLocalCache: (url: string, resp: any, expires: number, filter: (data: any) => any) => void;
export declare const useLocalCache: <T>(url: string) => T | null;
export declare const memoize: (url: string, resp: any, filter: (data: any) => any) => void;
export declare const useMemoized: <T>(url: string) => T | null;
