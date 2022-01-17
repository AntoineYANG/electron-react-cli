import type { ListrTask, ListrRendererFactory } from 'listr2';
import type { VersionInfo } from '@request/request-npm';
import type { InstallResult } from '@@install/utils/download-deps';
interface Context {
    diff: VersionInfo[];
    installResults: InstallResult[];
}
declare const installResolvedDeps: <T extends Context>() => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default installResolvedDeps;
