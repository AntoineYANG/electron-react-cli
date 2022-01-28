/*
 * @Author: Kanata You 
 * @Date: 2022-01-26 13:58:40 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:04:56
 */
import * as inquirer from 'inquirer';

import installAll from '@@install/scripts/install-all';
import env from '@env';
import { lazyUpdate } from '@lazy';


const installForPackage = async (name: string): Promise<void> => {
  const { doInstall } = await inquirer.prompt([{
    type: 'confirm',
    name: 'doInstall',
    message: 'Install now?',
    default: true
  }]);

  if (doInstall) {
    env[lazyUpdate](['packages', 'packageMap']);
    await installAll(false, [name]);
  }
};


export default installForPackage;
