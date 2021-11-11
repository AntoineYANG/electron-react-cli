/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 11:54:03 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 20:42:06
 */

import chalk from 'chalk';
import readline from 'readline';
import { requireBooleanInput, requireCheckBoxInput, requireOptionInput, requireStringInput } from './qa-ui';
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
  checker?: (value: string | Record<string, boolean>) => boolean;
  /** Description for this object */
  desc?: string;
  /** Displays when input is not valid */
  tips?: (input: string) => string;
  /** The array of expected values */
  options?: [string, boolean, string?][] | string[];
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
  console.log(chalk`{${styles.pink} ┏═TABLE${'═'.repeat(25)}}`);
  const result: ExpectedValue<P> = {};

  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout
  });

  const ask = async () => {
    for (const [key, schema] of Object.entries(properties)) {
      await new Promise<void>(async resolve => {
        if (schema.onlyIf?.(result) === false) {
          resolve();
          return;
        }
        const name = schema.alias ?? key.split('').map((s, i) => (i === 0 ? s.toLocaleUpperCase() : s)).join('');
        const defaultValue = schema.defaultValue ? `(${schema.defaultValue}) ` : '';
        let val = undefined;

        switch (schema.type ?? 'string') {
          case 'boolean': {
            val = await requireBooleanInput(name, schema.defaultValue ?? false, schema, rl);
            break;
          }

          case 'option': {
            if ((schema.options ?? []).length) {
              val = await requireOptionInput(name, schema.options as string[], schema);
            }
            break;
          }

          case 'checkbox': {
            if ((schema.options ?? []).length) {
              val = await requireCheckBoxInput(name, schema.options as [string, boolean, string?][], schema);
            }
            break;
          }

          default: {
            val = await requireStringInput(name, defaultValue, schema, rl);
          }
        }
        result[key as keyof P] = val;
        resolve();
      });
      await new Promise<void>(r => setTimeout(r, 120));
    }
  
    console.log(chalk`{${styles.pink} │ ${'╍'.repeat(28)}}`);
    
    const display = JSON.stringify(result, undefined, 2).split('\n').map(line => chalk`{${styles.pink} │} {${styles.white} ${line}}`).join('\n');
    console.log(display);
    
    if (retell) {
      console.log(chalk`{${styles.pink} │ ${'╌'.repeat(28)}}`);
      
      const ok = await requireBooleanInput(
        ' Is this OK?',
        true,
        {
          defaultValue: true
        },
        rl
      );

      if (!ok) {
        console.log(chalk`{${styles.pink} ├${'─'.repeat(30)}}`);
        await ask();
      }
    }
  };

  await ask();
  
  console.log(chalk`{${styles.pink} ╘${'═'.repeat(31)}}`);

  return result;
};

export default requireInput;
