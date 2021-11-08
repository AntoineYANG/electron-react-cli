/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 11:15:35 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 03:25:50
 */

import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { spawnSync } from 'child_process';
import hello from './utils/hello';
import requireInput from './utils/require-input';
import initProject from './utils/init';


const createProject = async (dir = '.') => {
  const user = (() => {
    try {
      // Windows 下 npm 执行名不同
      const source = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const extra = spawnSync(source, ['whoami'], {
        encoding: 'utf-8'
      }).stdout.replace(/\n/, '');
      return extra;
    } catch (err) {
      console.error('!!', err);
      return undefined;
    }
  })();

  hello('New project');
  
  const baseConfig = await requireInput({
    name: {
      pattern: /^[a-zA-Z0-9\-_@/]+$/,
      desc: 'Name of the project',
      required: true,
      defaultValue: resolve(dir).split(/\/|\\/).reverse()[0]
    },
    git: {
      alias: 'Git SSH',
      pattern: /^git@github.com:.*\/.*\.git$/
    },
    description: {
      desc: 'Description of this project',
      defaultValue: ''
    },
    keywords: {
      desc: 'Keywords of this project, split by ","'
    },
    version: {
      pattern: /^\d+\.\d+\.\d+(-(alpha|beta)-\d+\.\d+\.\d+)?$/,
      required: true,
      defaultValue: '0.0.0',
      tips: _ => 'Version must be like a.b.c or a.b.c-alpha|beta-aa.bb.cc'
    },
    license: {
      desc: 'License',
      defaultValue: 'MIT'
    },
    author: {
      desc: 'Author of this project',
      defaultValue: user
    }
  }, true);

  const tsConfig = await requireInput({
    useTypeScript: {
      type: 'boolean',
      desc: 'Enable this will let your project be built on TS',
      required: true,
      defaultValue: true
    },
    compileTarget: {
      onlyIf: ({ useTypeScript }) => useTypeScript
    }
  });

  const { useSass = true } = await requireInput({
    useSass: {
      type: 'boolean',
      desc: 'Enable this will let your project be built on sass',
      required: true,
      defaultValue: true
    }
  });

  if (dir !== '.' && !existsSync(dir)) {
    mkdirSync(dir);
  }

  initProject(resolve(dir), {
    package: {
      name: baseConfig.name,
      git: baseConfig.git,
      keywords: baseConfig.keywords ? baseConfig.keywords.split(/,\s*/) : undefined,
      description: baseConfig.description,
      version: baseConfig.version,
      license: baseConfig.license,
      author: baseConfig.author
    },
    typescript: tsConfig.useTypeScript ? {
      target: 'ES6',
      allowJS: true,
      module: 'esnext',
      emit: false
    } : undefined,
    sass: useSass
  });

  return 0;
};

export default createProject;
