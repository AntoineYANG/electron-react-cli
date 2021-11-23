import { ListrTask } from 'listr2';
import type { VersionInfo } from '@request/request-npm';
export declare const readDirAll: (dir: string) => string[];
export interface InstallResult {
    name: string;
    version: string;
    err: Error | null;
    data?: {
        size: number;
        unpackedSize: number;
        /** where is me, absolute path */
        dir: string;
    };
    _request: {
        url: string;
    };
}
declare const batchDownload: (modules: VersionInfo[], onProgress?: ((completed: string[], failed: string[], total: string[]) => void) | undefined, onEnd?: ((res: InstallResult) => void) | undefined) => ListrTask[];
export default batchDownload;
