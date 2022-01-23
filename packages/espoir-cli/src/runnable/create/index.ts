/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 19:04:52 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:47:40
 */

import RunnableScript from '@runnable';
import newMonorepo from '@@create/scripts/new-monorepo';
import newPackage from '@@create/scripts/new-package';

import env from '@env';


const Create: RunnableScript = {
  fullName: 'create',
  displayName: env.rootDir ? 'new package' : 'new monorepo',
  aliases: ['new'],
  description: env.rootDir ? 'Create new package in this monorepo' : 'Create new espoir monorepo',
  usage: '',
  args: [],
  options: [],
  exec: async () => {
    if (env.rootDir) {
      return newPackage();
    } else {
      return newMonorepo();
    }
  }
};

export default Create;
