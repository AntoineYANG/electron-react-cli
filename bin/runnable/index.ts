/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 01:43:49 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 00:23:39
 */

import { ExitCode } from '..';


export type ArgConfig<
  V extends boolean = false
> = (
  V extends true ? {
    requiresValue: V;
    defaultValue?: string;
  } : {
    requiresValue?: V;
    defaultValue?: boolean;
  }
) & {
  desc: string;
  shorthands?: string[];
};

export type RunnableConfig = {
  desc: string;
  args: {
    [name: string]: ArgConfig;
  };
};

type UnsureOptions<RC extends RunnableConfig> = {
  [name in keyof RC['args']]?: (
    RC['args'][name]['requiresValue'] extends true ? string : boolean
  );
};

type UnsureEntries<RC extends RunnableConfig> = {
  [name in keyof RC['args']]: (
    RC['args'][name]['defaultValue'] extends (string | boolean) ? never : name
  );
};

type UnsureKeys<RC extends RunnableConfig> = Exclude<UnsureEntries<RC>[keyof RC['args']], never>;

type EnsuredKeys<RC extends RunnableConfig> = Exclude<keyof RC['args'], UnsureKeys<RC>>;

export type ParsedOptions<RC extends RunnableConfig> = {
  [name in UnsureKeys<RC>]: UnsureOptions<RC>[name];
} & {
  [name in EnsuredKeys<RC>]: Required<UnsureOptions<RC>>[name];
};

export class OptionParseError extends Error {

  constructor(msg: string) {
    super(msg);
    this.name = 'OptionParseError';
  }

}

/**
 * A Runnable instance is a context used to execute a certain operation.
 * 
 * @class Runnable
 */
export default class Runnable<RC extends RunnableConfig> {

  /** full name to call */
  static readonly fullName: string;

  /** name to display */
  static readonly displayName: string;

  /** aliases to call */
  static readonly aliases: string[];

  /** input arguments */
  readonly originArgs: string[];
  
  /** argument type configs */
  readonly optionConfig: RC;

  /** input parameters */
  readonly params: string[];

  /** parsed arguments */
  readonly options: ParsedOptions<RC>;

  constructor(args: string[], optionConfig?: RC) {
    this.originArgs = args;
    if (!optionConfig) {
      throw new Error('Cannot create an unimplemented Runnable instance');
    }
    this.optionConfig = optionConfig;
    const [params, options] = this.useParsedInput(args);
    this.params = params;
    this.options = options;
  }
  
  exec(): Promise<ExitCode> {
    throw new Error('Cannot call `exec()` on unimplemented Runnable.');
  }

  useParsedInput(args: string[]): [string[], ParsedOptions<RC>] {
    const params: string[] = [];
    const options = {} as ParsedOptions<RC>;

    const uncompletedArg = args.reduce<keyof typeof options | undefined>((name, arg) => {
      if (name === undefined) {
        const match = /^-(?<flag>-)?(?<n>[a-zA-Z\-]+)$/.exec(arg);

        if (match) {
          if (name) {
            throw new OptionParseError(
              `Argument ${name} requires a value`
            );
          }
          const { flag, n } = match.groups as {
            flag?: string;
            n: string;
          };

          const key = Object.entries(this.optionConfig.args).filter(
            ([_name, config]) => flag ? !config.requiresValue : config.requiresValue
          ).find(
            ([name, { shorthands }]) => (
              name === n || shorthands?.includes(n)
            )
          )?.[0] as (keyof typeof options & string) | undefined;

          if (!key) {
            throw new OptionParseError(
              `No argument match "${n}"`
            );
          }

          const isFlag = Boolean(flag);

          if (isFlag) {
            (options[key] as boolean) = true;

            return undefined;
          }

          return key;
        }

        params.push(arg);
      } else {
        (options[name] as string) = arg;
      }

      return undefined;
    }, undefined);

    if (uncompletedArg) {
      throw new OptionParseError(
        `Argument ${uncompletedArg} requires a value`
      );
    }

    return [params, options];
  }

}

export interface RunnableConstructor<RC extends RunnableConfig = RunnableConfig> {
  new (args: string[]): Runnable<RC>;

  /** full name to call */
  readonly fullName: string;

  /** name to display */
  readonly displayName: string;

  /** aliases to call */
  readonly aliases: string[];
}
