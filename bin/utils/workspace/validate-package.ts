/*
 * @Author: Kanata You 
 * @Date: 2021-11-15 23:23:40 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 23:32:29
 */

import env from '../env';


export const WorkspaceRoot = ':';

const validPackagePtn = /^(:|(:(?<name>[\-_a-zA-Z0-9]+)))$/;

/**
 * If the given string match package pattern, returns the name of the package, else returns false.
 *
 * @param {string} arg
 * @returns {(string | null)}
 */
const validatePackage = (arg: string): string | null => {
  const match = validPackagePtn.exec(arg);

  if (match) {
    const { name } = match.groups as {
      name?: string;
    };

    if (!name) {
      // root
      return WorkspaceRoot;
    } else {
      // check if actually exists
      if (env.packages.includes(name)) {
        return name;
      }
    }
  }

  return null;
};


export default validatePackage;
