/*
 * @Author: Kanata You 
 * @Date: 2022-01-28 16:50:04 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 17:28:46
 */

import type { ListrTask, ListrRendererFactory } from 'listr2';

import setPackageExported from '@@use/utils/set-package-exported';


const exportPackage = (name: string): ListrTask<{}, ListrRendererFactory> => ({
  title: `Export.`,
  task: async (_ctx, task) => {
    task.output = `Exporting ${name}`;
    setPackageExported(name);
    task.output = 'Exported successfully';
  }
});


export default exportPackage;
