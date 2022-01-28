/*
 * @Author: Kanata You 
 * @Date: 2022-01-23 21:06:27 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 16:33:04
 */

import * as path from 'path';
import * as fs from 'fs';
import { sync as mkdirp } from 'mkdirp';
import * as inquirer from 'inquirer';

import env from '@env';
import type { EspoirTemplate } from '@@create/utils/load-template';


const cliTemplate: EspoirTemplate = {
  name: 'CLI',
  create: async (name, enableTS) => {
    const dir = env.resolvePathInPackage(name);

    mkdirp(path.join(dir, 'configs'));
    mkdirp(path.join(dir, 'scripts'));
    mkdirp(path.join(dir, 'tasks'));
    mkdirp(path.join(dir, 'src'));
    
    if (enableTS) {
      mkdirp(path.join(dir, 'bin'));
    }

    const { useNpm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'useNpm',
      message: 'Use npm?'
    }]);

    if (useNpm) {
      fs.writeFileSync(
        path.join(dir, '.npmignore'),
        [
          enableTS ? '/src' : false,
          '/configs',
          '/scripts',
          enableTS ? 'tsconfig.json' : false
        ].filter(Boolean).join('\n') + '\n', {
          encoding: 'utf-8'
        }
      );
    }

    const main = enableTS ? './bin/index.js' : './src/index.js';
    const files = [
      'LICENSE',
      'README.md',
      'README-*.md',
      'CHANGELOG-*.md',
      enableTS ? '/bin/' : '/src/',
      enableTS ? '/lib/' : false
    ].filter(Boolean) as string[];
    const bin = {
      [name]: main
    };
    const types = enableTS ? './lib/index.d.ts' : undefined;
    const exports = {
      '.': [
        {
          default: main
        },
        main
      ],
      './package.json': './package.json'
    };

    const packageJSON = {
      ...require(path.join(dir, 'package.json')),
      scripts: {
        build: `cd ${env.resolvePathInPackage(name)} && tsc`
      },
      main,
      files,
      preferGlobal: true,
      bin,
      types,
      exports
    };

    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(
        packageJSON,
        undefined,
        2
      ) + '\n', {
        encoding: 'utf-8'
      }
    );

    fs.writeFileSync(
      path.join(dir, enableTS ? 'bin' : 'src', 'index.js'),
      `/** ESPOIR TEMPLATE */

const main = () => {
  console.log('hello world');

  return 0;
};

if (require.main === module) {
  process.exit(main());  
}

module.exports = main;

`, {
        encoding: 'utf-8'
      }
    );

    if (enableTS) {
      fs.writeFileSync(
        path.join(dir, 'src', 'index.ts'),
        `/** ESPOIR TEMPLATE */

        const main = (): number => {
  console.log('hello world');

  return 0;
};

if (require.main === module) {
  process.exit(main());  
}

export default main;

`, {
          encoding: 'utf-8'
        }
      );

      mkdirp(path.join(dir, 'typings'));

      fs.writeFileSync(
        path.join(dir, 'typings', 'index.d.ts'),
        '\n', {
          encoding: 'utf-8'
        }
      );

      fs.writeFileSync(
        path.join(dir, 'tsconfig.json'),
        JSON.stringify({
          extends: '../../tsconfig.base.json',
          include: ['./src/**/*'],
          exclude: ['node_modules', '.modules'],
          compilerOptions: {
            baseUrl: 'src',
            module: 'CommonJS',
            moduleResolution: 'Node',
            paths: {
              '@src/*': ['*']
            },
            declaration: true,
            preserveConstEnums: true,
            removeComments: false,
            sourceMap: false,
            allowJs: false,
            resolveJsonModule: true,
            target: 'ESNext',
            isolatedModules: true,
            allowUnusedLabels: false,
            alwaysStrict: true,
            exactOptionalPropertyTypes: true,
            noFallthroughCasesInSwitch: true,
            noImplicitAny: true,
            noImplicitOverride: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            noPropertyAccessFromIndexSignature: true,
            noUncheckedIndexedAccess: true,
            strict: true,
            strictBindCallApply: true,
            strictFunctionTypes: true,
            strictNullChecks: true,
            strictPropertyInitialization: true,
            useUnknownInCatchVariables: false,
            rootDirs: [
              'src/', '../../node_modules/'
            ],
            typeRoots: ['../../node_modules/@types/'],
            outDir: 'bin',
            declarationDir: 'lib'
          }
        },
          undefined,
          2
        ) + '\n', {
          encoding: 'utf-8'
        }
      );
    }
  }
};


export default cliTemplate;
