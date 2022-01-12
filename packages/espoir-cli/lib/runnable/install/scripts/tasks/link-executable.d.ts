import type { ListrTask } from 'listr2';
import type { DefaultRenderer } from 'listr2/dist/renderer/default.renderer';
import { SingleDependency } from '@@install/utils/load-dependencies';
import { CliLink } from '@@install/utils/link-cli';
interface Context {
    dependencies: SingleDependency[];
    bin: CliLink[];
}
declare const linkExecutable: <T extends Context>() => ListrTask<T, typeof DefaultRenderer>;
export default linkExecutable;
