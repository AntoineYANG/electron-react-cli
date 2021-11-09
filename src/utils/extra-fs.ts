/*
 * @Author: Kanata You 
 * @Date: 2021-11-09 14:56:18 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 21:20:43
 */

import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import styles from './styles';


export type FileNode = [string, string | Buffer] | [string, FileNode[]];

const relativePath = (root: string, path: string) => {
  const parent = root.split(/[\\\/]/g).filter((_, i, s) => i < s.length - 2).join('/');
  return path.split(/[\\\/]/g).join('/').split(parent)[1];
};

export const makeTemplate = (root: string, path: string, files: FileNode[]) => {
  if (!existsSync(path)) {
    mkdirSync(resolve(path));
    // console.log(resolve(path, 'a'));
    // console.log(relativePath(root, resolve(path, 'a')));
    const p = relativePath(root, resolve(path, 'a')).slice(0, -1);
    // console.log({ p });
    if (p.length > 1) {
      console.info(chalk`  {${styles.greenBright} +} {underline ${p}}`);
    }
  }
  files.forEach(f => {
    if (typeof f[1] === 'string' || f[1] instanceof Buffer) {
      console.info(chalk`  {${styles.greenBright}.bold U} {underline ${relativePath(root, resolve(path, f[0]))}}`);
      writeFileSync(resolve(path, f[0]), f[1]);
    } else {
      makeTemplate(root, resolve(path, f[0]), f[1]);
    }
  });
};
