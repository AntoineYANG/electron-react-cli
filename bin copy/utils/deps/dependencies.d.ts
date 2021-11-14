/*
 * @Author: Kanata You 
 * @Date: 2021-11-13 23:38:51 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 00:11:46
 */

export class DependentSource {

  readonly name: string;
  
  constructor(name: string);

}

export type DependencyType = (
  'dependencies' | 'devDependencies'
);

export type Dependence = {
  from: string[];
  to: string;
};

export type DependencySet = {
  [name: string]: Dependence[];
};

export type AllDependencies<T extends DependencyType = DependencyType> = {
  [key in T]: {
    [name: string]: {
      from: (string|DependentSource)[];
      to: string;
    }[];
  };
};

