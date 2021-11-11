/*
 * @Author: Kanata You
 * @Date: 2021-11-09 14:58:28
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 21:10:02
 */
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(resolve => {
      resolve(value); 
    }); 
  }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) {
      try {
        step(generator.next(value)); 
      } catch (e) {
        reject(e); 
      } 
    }

    function rejected(value) {
      try {
        step(generator.throw(value)); 
      } catch (e) {
        reject(e); 
      } 
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); 
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import { execSync } from 'child_process';
import chalk from 'chalk';
import styles from './styles.js';
export const installAll = (path, deps) => __awaiter(void 0, void 0, void 0, function *() {
  let succeed = 0;
  const failed = [];
  console.log(deps);
  deps.forEach(({ name, flag, version }) => {
    if (flag === 'peer') {
      return;
    }
    try {
      console.log(`cd "${path}" & npm i --save${flag === 'dev' ? '-dev' : ''} ${name}${version ? `@${version}` : ''}`);
      const output = execSync(`cd "${path}" & npm i --save${flag === 'dev' ? '-dev' : ''} ${name}${version ? `@${version}` : ''}`);
      console.log({ output });
      succeed += 1;
    } catch (error) {
      console.error('000', error);
      failed.push([{ name, flag, version }, error.message]);
    }
  });
  console.info(chalk`{${styles.yellow} ${succeed}} {${styles.white} modules successfully installed}`);

  if (failed.length) {
    console.info(chalk`{${styles.red} ${failed.length} modules failed:}`);
    failed.forEach(([dep, reason]) => {
      console.info(`${chalk`{${styles.red} ${dep.name + (dep.version ? `@${dep.version}` : '')}}`} ${ 
        reason ? chalk`{${styles.gray} - ${reason}}` : ''}`);
    });
  }
  console.log();
});
// # sourceMappingURL=dependencies.js.map
