import { ListrBaseClassOptions, Manager } from 'listr2';
import { Argument, Option } from 'commander';
import { ExitCode } from '@src/index';
export default interface RunnableScript {
    /** full name to call */
    readonly fullName: string;
    /** name to display */
    readonly displayName: string;
    /** aliases to call */
    readonly aliases: string[];
    readonly description: string;
    readonly usage: string;
    readonly args: Argument[];
    readonly options: Option[];
    readonly exec: (...args: any[]) => Promise<ExitCode>;
}
/**
 * @see https://listr2.kilic.dev/task-manager/use-case
 */
export declare const TaskManagerFactory: <T = any>(override?: ListrBaseClassOptions<any, "default", "verbose"> | undefined) => Manager<T, "default", "verbose">;
