/*
 * @Author: Kanata You 
 * @Date: 2021-11-09 14:58:28 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 21:10:02
 */

import { execSync } from 'child_process';
import chalk from 'chalk';
import styles from './styles';


export type DependenciesInfo = {
  name: string;
  flag?: 'dev' | 'peer';
  version?: string;
};

export const installAll = async (path: string, deps: DependenciesInfo[]) => {
  let succeed = 0;
  const failed: [DependenciesInfo, string][] = [];
  console.log(deps);
  deps.forEach(({ name, flag, version }) => {
    if (flag === 'peer') {
      return;
    }
    try {
      console.log(`cd "${path}" & npm i --save${flag === 'dev' ? '-dev' : ''} ${name}${version ? `@${version}` : ''}`);
      const output = execSync(
        `cd "${path}" & npm i --save${flag === 'dev' ? '-dev' : ''} ${name}${version ? `@${version}` : ''}`
      );
      console.log({ output });
      succeed += 1;
    } catch (error) {
      console.error('000', error);
      failed.push([{ name, flag, version }, (error as Error).message]);
    }
  });
  console.info(chalk`{${styles.yellow} ${succeed}} {${styles.white} modules successfully installed}`);

  if (failed.length) {
    console.info(chalk`{${styles.red} ${failed.length} modules failed:}`);
    failed.forEach(([dep, reason]) => {
      console.info(
        `${chalk`{${styles.red} ${dep.name + (dep.version ? `@${dep.version}` : '')}}`} ${ 
          reason ? chalk`{${styles.gray} - ${reason}}` : ''}`
      );
    });
  }
  console.log();
};
