/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 20:52:16 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 21:14:22
 */

import * as path from 'path';
import * as fs from 'fs';


export interface EspoirTemplate {
  name: string;
  create: (name: string, enableTS: boolean) => Promise<void>;
}

export const getAllSupportedTemplates = (): EspoirTemplate[] => {
  const res: EspoirTemplate[] = [];  
  
  // original templates

  const dir = path.join(__dirname, 'template');

  fs.readdirSync(dir).forEach(n => {
    const fn = path.join(dir, n);

    const data = require(fn).default as EspoirTemplate;

    if (data.name && data.create && !res.find(d => d.name === data.name)) {
      res.push(data);
    }
  });
  
  return res;
};

/**
 * Initialize a package with template.
 *
 * @param {string} name name of the new package
 * @param {boolean} enableTS
 * @param {string} template name of the template
 * @returns {Promise<boolean>} whether the operation succeeded
 */
const loadTemplate = async (name: string, enableTS: boolean, template: string): Promise<boolean> => {
  const all = getAllSupportedTemplates();
  const which = all.find(d => d.name === template);

  if (which) {
    try {
      await which.create(name, enableTS);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
};


export default loadTemplate;
