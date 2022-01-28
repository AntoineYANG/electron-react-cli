/*
 * @Author: Kanata You 
 * @Date: 2022-01-28 16:58:46 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:15:16
 */

import * as fs from 'fs';

import env, { PackageJSON } from '@env';


const setPackageExported = (name: string) => {
  const fn = env.resolvePathInPackage(name, 'package.json');
  const data = env.packageMap?.[name] as PackageJSON;

  data.espoirPackage = 'module';

  fs.writeFileSync(
    fn,
    JSON.stringify({
      ...data,
      espoirPackage: 'module'
    }, undefined, 2) + '\n', {
      encoding: 'utf-8'
    }
  );
};


export default setPackageExported;
