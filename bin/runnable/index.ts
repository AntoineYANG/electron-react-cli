/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 01:43:49 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-19 23:48:53
 */

import { ListrBaseClassOptions, Manager } from 'listr2';
import { Argument, Option } from 'commander';

import { ExitCode } from '..';


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
export const TaskManagerFactory = <T = any>(override?: ListrBaseClassOptions): Manager<T> => {
  const myDefaultOptions: ListrBaseClassOptions = {
    concurrent: false,
    exitOnError: false,
    rendererOptions: {
      collapse: false,
      collapseSkips: false
    }
  };

  return new Manager({ ...myDefaultOptions, ...override });
};
