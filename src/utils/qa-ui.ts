/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 20:57:23 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 03:24:20
 */

import chalk from 'chalk';
import readline from 'readline';
import type { PropertySchema } from './require-input';
import styles from './styles';


const printResult = (info: string, spaces: number) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.moveCursor(0, -1);
  console.log(info + ' '.repeat(spaces - info.length + 1));
  readline.cursorTo(process.stdout, 0);
  process.stdout.moveCursor(0, -1);
};

export const requireStringInput = (
  name: string, defaultValue: string, schema: PropertySchema, rl: readline.Interface
) => new Promise<string | undefined>(resolve => {
  const text = (info?: string) => {
    return chalk`{${styles.blueBright}.bold ${'> ' + name}}` + (
      schema.required ? '' : chalk` {grey <optional>}`
    ) + (
      schema.desc ? chalk` {${styles.blue} ${`/** ${schema.desc} */`}}` : ''
    ) + chalk`{${styles.blueBright} ${': '}}` + (
      info ? chalk`{${styles.red} ${' ' + info + ' '}}` : ''
    ) + chalk`{gray.underline ${defaultValue.trim()}}` + ' ';
  };
  
  const question = (info?: string) => {
    rl.question(
      text(info),
      ans => {
        if (ans.length === 0) {
          if (schema.defaultValue !== undefined) {
            let info = `  ${
              chalk.blueBright(`${name}: `)
            }${
              schema.defaultValue
            }`;
            printResult(info, text(info).length);
            resolve(schema.defaultValue);
            return;
          }
          if (schema.required) {
            const tips = schema.tips?.(ans) ?? `"${name}" is required`;
            process.stdout.moveCursor(0, -1);
            question(tips);
          } else {
            let info = `  ${
              chalk.blue(`${name}: `)
            }${
              chalk.grey('undefined')
            }`;
            printResult(info, text(info).length);
            resolve(undefined);
          }
          return;
        }
        if (schema.pattern?.test(ans) === false || schema.checker?.(ans) === false) {
          const tips = schema.tips?.(ans) ?? `"${ans}" is not an valid value`;
          question(tips);
          return;
        } else {
          let info = `  ${
            chalk.blueBright(`${name}: `)
          }${
            chalk.white(ans)
          }`;
          printResult(info, text(info).length);
          resolve(ans);
          return;
        }
      }
    );
  }
  question();
});

export const requireBooleanInput = (
  name: string, defaultValue: boolean, schema: PropertySchema, rl: readline.Interface
) => new Promise<boolean>(resolve => {
  const text = (checked: boolean) => {
    const raw = chalk`{${styles.blueBright}.bold >}` + (
      // checked ? chalk.green`🗹` : chalk.white`☐`
      checked ? chalk` {${styles.green} ✓}` : chalk` {${styles.red} ☐}`
    ) + ' ' + chalk`{${styles.blueBright}.bold ${name}}` + (
      schema.desc ? chalk` {${styles.blue} ${`/** ${schema.desc} */`}}` : ''
    );
    return raw + '\n' + chalk`{${
      styles.yellow
    } Press {bold.underline space} to shift and press {bold.underline enter} to confirm}`;
  };
  
  console.info(text(defaultValue));

  let value = defaultValue;
  let debounceLock = false;

  const listener = (_: any, key: any) => {
    if (key?.ctrl && key.name == 'c') {
      process.stdin.pause();
      return;
    }
    if (debounceLock) {
      return;
    } else {
      debounceLock = true;
      setTimeout(() => {
        debounceLock = false;
      }, 80);
    }
    if (key.sequence === ' ') {
      value = !value;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -2);
      console.info(text(value));
    } else if (/(\n|\r)/.test(key.sequence)) {
      resolve(value);
      process.stdin.removeListener('keypress', listener);
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.moveCursor(0, -2);
      let info = chalk`  {${styles.blueBright} ${
        `${name}: `
      }}{${styles.yellow} ${
        JSON.stringify(value)
      }}`;
      printResult(info, text(!value).length);
      return;
    }
    process.stdout.clearLine(0);
  };
  
  process.stdin.on('keypress', listener);
});
