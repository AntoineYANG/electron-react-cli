import type { ListrTask, ListrRendererFactory } from 'listr2';
import { SingleDependency } from '@@install/utils/load-dependencies';
import { CliLink } from '@@install/utils/link-cli';
interface Context {
    dependencies: SingleDependency[];
    bin: CliLink[];
}
declare const linkExecutable: <T extends Context>() => ListrTask<T, typeof import("listr2").ListrRenderer>;
export default linkExecutable;
