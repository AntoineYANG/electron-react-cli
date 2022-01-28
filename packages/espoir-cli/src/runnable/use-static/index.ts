/*
 * @Author: Kanata You 
 * @Date: 2021-11-14 02:00:17 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:25:36
 */

import { Argument } from 'commander';

import RunnableScript from '@runnable';
import env from '@env';
import exportPackages from './scripts/export-packages';


const validPackages = (env.packages ?? []).filter(name => (
  env.packageMap?.[name]?.espoirPackage !== 'module'
));

/**
 * @since 1.1.0
 */
const UseStatic: RunnableScript = {
  fullName: 'use-static',
  displayName: 'use-static',
  aliases: ['use', 'static', 'export'],
  description: 'Export the package(s) to the whole monorepo',
  usage: '[option] <packages...>',
  args: [
    new Argument(
      '[packages...]',
      'local package(s) to export'
    )
  ],
  options: [],
  exec: async (
    packages: string[]
  ) => {
    if (packages.length === 0) {
      const msg = 'You have to give at least one package.';

      throw new Error(msg);
    }

    for (const name of packages) {
      if (!validPackages.includes(name)) {
        const msg = `"${name}" is unable to be exported.`;

        throw new Error(msg);
      }
    }

    return await exportPackages(packages);
  }
};

export default UseStatic;
