import type { ListrTask, ListrRendererFactory } from 'listr2';
import type { InstallResult } from '@@install/utils/download-deps';
interface Context {
    installResults: InstallResult[];
}
declare const saveFailMsg: <T extends Context>() => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default saveFailMsg;
