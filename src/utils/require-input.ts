/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 11:54:03 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 02:16:20
 */

import chalk from 'chalk';
import readline from 'readline';
import { requireBooleanInput, requireStringInput } from './qa-ui';
import styles from './styles';


export type PropertySchema = {
  type?: 'boolean' | 'option' | 'checkbox';
  /** If defined, the param will appear only when the situation is satisfied */
  onlyIf?: (temp: any) => boolean;
  /** Display name */
  alias?: string;
  /** If true, the value should not be undefined */
  required?: boolean;
  /** The expected value regex needs to be satisfied by the value */
  pattern?: RegExp;
  /** Tells if the value is valid */
  checker?: (value: string) => boolean;
  /** Description for this object */
  desc?: string;
  /** Displays when input is not valid */
  tips?: (input: string) => string;
  /** The array of expected values */
  expected?: {
    value: any;
    label: string;
    desc?: string;
  }[];
  /** Default value */
  defaultValue?: any;
};

export type Properties = {
  [name: string]: PropertySchema;
};

type ExpectedValue<P extends Properties> = {
  [name in keyof P]?: any | undefined;
};

const requireInput = async <P extends Properties>(properties: P, retell = false): Promise<ExpectedValue<P>> => {
  console.log(chalk`{${styles.pink} ${'='.repeat(16)}}`);
  const result: ExpectedValue<P> = {};

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = async () => {
    for (const [key, schema] of Object.entries(properties)) {
      await new Promise<void>(async resolve => {
        if (schema.onlyIf?.(result) === false) {
          resolve();
          return;
        }
        const name = schema.alias ?? key.split('').map((s, i) => i === 0 ? s.toLocaleUpperCase() : s).join('');
        const defaultValue = schema.defaultValue ? `(${schema.defaultValue}) ` : '';
        let val = undefined;
        switch (schema.type ?? 'string') {
          case 'boolean': {
            val = await requireBooleanInput(name, schema.defaultValue ?? false, schema, rl);
            break;
          }
          case 'option': {
            break;
          }
          case 'checkbox': {
            break;
          }
          default: {
            val = await requireStringInput(name, defaultValue, schema, rl);
          }
        }
        result[key as keyof P] = val;
        resolve();
      });
    }
  
    process.stdout.write(' '.repeat(40) + '\n');

    const display = JSON.stringify(result, undefined, 2).split('\n');
    const maxLen = display.reduce((prev, cur) => Math.max(prev, cur.length), 0);
    
    display.forEach(s => {
      console.log(
        chalk`{cyan ${s.replace(/ /g, chalk.gray('_'))}}{gray ${'_'.repeat(maxLen + 1 - s.length)}}`
      );
    });
    console.log();

    const ok = await new Promise<boolean>(res => {
      if (!retell) {
        res(true);
        return;
      }
      rl.question(
        chalk`{cyanBright Is this OK?} {gray ({white ${chalk.underline('Y')}}/n)} `,
        ans => {
          res(ans.toLocaleLowerCase() !== 'n');
          process.stdout.write('\n\n');
        }
      );
    });

    if (retell && !ok) {
      await ask();
    }
  };

  await ask();

  return result;
};

export default requireInput;
