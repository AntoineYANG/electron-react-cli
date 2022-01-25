"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 21:06:27
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 22:06:29
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

const fs = require("fs");

const mkdirp_1 = require("mkdirp");

const inquirer = require("inquirer");

const _env_1 = require("../../../../utils/env");

const cliTemplate = {
  name: 'CLI',
  create: async (name, enableTS) => {
    const dir = _env_1.default.resolvePathInPackage(name);

    (0, mkdirp_1.sync)(path.join(dir, 'configs'));
    (0, mkdirp_1.sync)(path.join(dir, 'scripts'));
    (0, mkdirp_1.sync)(path.join(dir, 'tasks'));
    (0, mkdirp_1.sync)(path.join(dir, 'src'));
    const {
      useNpm
    } = await inquirer.prompt([{
      type: 'confirm',
      name: 'useNpm',
      message: 'Use npm?'
    }]);

    if (useNpm) {
      fs.writeFileSync(path.join(dir, '.npmignore'), [enableTS ? '/src' : false, '/configs', '/scripts', enableTS ? 'tsconfig.json' : false].filter(Boolean).join('\n') + '\n', {
        encoding: 'utf-8'
      });
      const main = enableTS ? './bin/index.js' : './src/index.js';
      const files = ['LICENSE', 'README.md', 'README-*.md', 'CHANGELOG-*.md', enableTS ? '/bin/' : '/src/', enableTS ? '/lib/' : false].filter(Boolean);
      const bin = {
        [name]: main
      };
      const types = enableTS ? './lib/index.d.ts' : undefined;
      const exports = {
        '.': [{
          default: main
        }, main],
        './package.json': './package.json'
      };
      const packageJSON = { ...require(path.join(dir, 'package.json')),
        main,
        files,
        preferGlobal: true,
        bin,
        types,
        exports
      };
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJSON, undefined, 2) + '\n', {
        encoding: 'utf-8'
      });
    }

    fs.writeFileSync(path.join(dir, enableTS ? 'bin' : 'src', 'index.js'), `/** ESPOIR TEMPLATE */

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
    });

    if (enableTS) {
      (0, mkdirp_1.sync)(path.join(dir, 'bin'));
      fs.writeFileSync(path.join(dir, 'src', 'index.ts'), `/** ESPOIR TEMPLATE */

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
      });
      fs.writeFileSync(path.join(dir, 'scripts', 'build.js'), `/** ESPOIR TEMPLATE */
        
const { exec } = require('child_process');


const tscBuild = () => new Promise(resolve => {
  exec('npx tsc', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    if (stderr) {
      console.error(stderr);
      process.exit(2);
    }

    console.log(stdout);
    resolve();
  });
});

const main = async () => {
  try {
    await tscBuild();
  } catch (error) {
    console.error(error);

    return 1;
  }

  return 0;
};


main().then(process.exit);
`, {
        encoding: 'utf-8'
      });
      (0, mkdirp_1.sync)(path.join(dir, 'typings'));
      fs.writeFileSync(path.join(dir, 'typings', 'index.d.ts'), '\n', {
        encoding: 'utf-8'
      });
      fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
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
          rootDirs: ['src/', '../../node_modules/'],
          typeRoots: ['../../node_modules/@types/'],
          declarationDir: 'lib'
        }
      }, undefined, 2) + '\n', {
        encoding: 'utf-8'
      });
    }
  }
};
exports.default = cliTemplate;