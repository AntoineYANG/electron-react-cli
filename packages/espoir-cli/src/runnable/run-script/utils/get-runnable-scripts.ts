/*
 * @Author: Kanata You 
 * @Date: 2021-11-30 19:15:56 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:22:44
 */

import * as fs from 'fs';
import * as path from 'path';

import env, { PackageJSON } from '@env';


export interface LocalScript {
  name: string;
  cmd: string;
  cwd: string;
}


const physicalScriptDirs: readonly string[] = [
  'scripts',
  'tasks'
];

const physicalScriptLoader: Readonly<{
  [type: string]: (name: string) => string
}> = {
  js: name => `node ${name}.js`,
  bat: name => `${name}.bat`,
  sh: name => `${name}.sh`,
  exe: name => `${name}.exe`,
  '': name => name
};

const getPhysicalScripts = (scope: string, defined: string[]): LocalScript[] => {
  const res: LocalScript[] = [];

  const dir = scope === 'root' ? env.rootDir as string : env.resolvePathInPackage(scope);
  
  physicalScriptDirs.forEach(d => {
    const __dir = path.join(dir, d);

    if (fs.existsSync(__dir) && fs.statSync(__dir).isDirectory()) {
      fs.readdirSync(__dir).forEach(f => {
        const fn = path.join(__dir, f);

        if (fs.statSync(fn).isFile()) {
          const tmp = f.split('.');
          const name = tmp.slice(0, tmp.length - 1).join('.');
          const scriptName = `${scope}.${name}`;

          if (defined.includes(scriptName)) {
            return;
          }
          
          const type = tmp.length > 1 ? tmp[tmp.length - 1] as string : '';
          const loaded = physicalScriptLoader[type];

          if (loaded) {
            res.push({
              name: scriptName,
              cmd: loaded(name),
              cwd: __dir
            });
            defined.push(scriptName);
          }
        }
      });
    }
  });

  return res;
};

/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {RunnableScript[]}
 */
const getRunnableScripts = (scope?: string): LocalScript[] => {
  if (scope) {
    const res: LocalScript[] = scope === 'root' ? (
      Object.entries(env.rootPkg?.scripts ?? {}).map(([n, cmd]) => ({
        name: `root.${n}`,
        cmd,
        cwd: env.rootDir as string
      }))
    ) : (
      Object.entries((env.packageMap?.[scope] as PackageJSON).scripts ?? {}).map(([n, cmd]) => ({
        name: `${scope}.${n}`,
        cmd,
        cwd: env.resolvePathInPackage(scope)
      }))
    );

    res.push(
      ...getPhysicalScripts(scope, res.map(d => d.name))
    );

    return res.sort(
      ({ name: a }, { name: b }) => {
        for (let i = 0; i < a.length && i < b.length; i += 1) {
          if (a.charCodeAt(i) !== b.charCodeAt(i)) {
            return a.charCodeAt(i) - b.charCodeAt(i);
          }
        }

        return a.length - b.length;
      }
    );
  }

  const allScripts: LocalScript[] = [];

  allScripts.push(
    ...Object.entries(env.rootPkg?.scripts ?? {}).map(([n, cmd]) => ({
      name: `root.${n}`,
      cmd,
      cwd: env.rootDir as string
    }))
  );

  allScripts.push(
    ...getPhysicalScripts('root', allScripts.map(d => d.name))
  );

  env.packages?.forEach(p => {
    allScripts.push(
      ...Object.entries((env.packageMap?.[p] as PackageJSON).scripts ?? {}).map(([n, cmd]) => ({
        name: `${p}.${n}`,
        cmd,
        cwd: env.resolvePathInPackage(p)
      }))
    );

    allScripts.push(
      ...getPhysicalScripts(p, allScripts.map(d => d.name))
    );
  });

  return allScripts.sort(
    ({ name: a }, { name: b }) => {
      for (let i = 0; i < a.length && i < b.length; i += 1) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
          return a.charCodeAt(i) - b.charCodeAt(i);
        }
      }

      return a.length - b.length;
    }
  );
};

export default getRunnableScripts;
