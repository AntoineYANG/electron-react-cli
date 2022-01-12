import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import type { InstallResult } from '@@install/utils/download-deps';
interface Context {
    installResults: InstallResult[];
}
declare const saveFailMsg: <T extends Context>() => ListrTask<T, typeof DefaultRenderer>;
export default saveFailMsg;
