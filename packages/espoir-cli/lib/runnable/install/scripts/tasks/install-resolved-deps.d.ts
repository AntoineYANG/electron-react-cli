import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { VersionInfo } from '@request/request-npm';
import type { InstallResult } from '@@install/utils/download-deps';
interface Context {
    diff: VersionInfo[];
    installResults: InstallResult[];
}
declare const installResolvedDeps: <T extends Context>() => ListrTask<T, typeof DefaultRenderer>;
export default installResolvedDeps;
