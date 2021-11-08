/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 19:07:13 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 03:54:45
 */

import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import styles from './styles';

import robotsTxt from '../templates/robots_txt';
import gitignore from '../templates/gitignore';


export type PackageConfig = {
  name: string;
  description?: string;
  keywords?: string[];
  version: string;
  license?: string;
  author?: string;
  git?: string;
};

const createPkgJSON = (path: string, config: PackageConfig) => {
  const data = {
    name: config.name,
    version: config.version,
    description: config.description,
    author: config.author,
    // "main": "index.js",
    // "scripts": {
    //   "build": "node --experimental-json-modules ./scripts/build",
    //   "test:create": "npm run build & node ./build/index.js create app"
    // },
    repository: config.git ? {
      type: 'git',
      url: `git+ssh://${config.git}`
    } : undefined,
    keywords: config.keywords,
    license: config.license,
    bugs: config.git ? {
      url: `https://github.com/${
        /^git@github.com:(?<addr>.+)\.git$/.exec(config.git)!.groups!.addr
      }/issues`
    } : undefined,
    homepage: config.git ? `https://github.com/${
      /^git@github.com:(?<addr>.+)\.git$/.exec(config.git)!.groups!.addr
    }#readme` : undefined,
    // "bin": {
    //   "espoir": "./build/index.js"
    // },
    // "type": "module",
    // "dependencies": {
    //   "chalk": "^4.1.2",
    //   "commander": "^8.3.0",
    //   "typescript": "^4.4.4"
    // },
    // "devDependencies": {
    //   "@types/node": "^16.11.6"
    // }
  };

  writeFileSync(resolve(path, 'package.json'), JSON.stringify(data, undefined, 2));

  console.info('🗸 ' + chalk.green`Created ${chalk.underline('package.json')}`);
};

export type TSConfig = {
  target: `ES${3|5|6|`21${15|16|17|18|19|20|21}`|'Next'}`;
  allowJS: boolean;
  module: 'AMD' | 'CommonJS' | 'esnext' | 'UMD' | 'ES6';
  emit: boolean;
};

const createTSConfig = (path: string, config: TSConfig) => {
  const data = {
    compilerOptions: {
      target: config.target,
      lib: [
        "dom",
        "dom.iterable",
        "esnext"
      ],
      allowJs: config.allowJS,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noFallthroughCasesInSwitch: true,
      module: config.module,
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      sourceMap: true,
      noEmit: !config.emit,
      baseUrl: ".",
      paths: {
      },
      outDir: config.emit ? "build" : undefined
    },
    "include": [
      "src/*"
    ],
    "exclude": [
      "node_modules/**/*"
    ]
  };
  
  writeFileSync(resolve(path, 'tsconfig.json'), JSON.stringify(data, undefined, 2));

  console.info('🗸 ' + chalk.green`Created ${chalk.underline('tsconfig.json')}`);
};

type FileNode = [string, string | Buffer] | [string, FileNode[]];

const relativePath = (root: string, path: string) => {
  return path.split(root)[1];
};

const makeTemplate = (root: string, path: string, files: FileNode[]) => {
  if (!existsSync(path)) {
    mkdirSync(resolve(path))
  }
  files.forEach(f => {
    if (typeof f[1] === 'string' || f[1] instanceof Buffer) {
      console.info(chalk`{${styles.green} +} {underline ${relativePath(root, resolve(path, f[0]))}}`);
      writeFileSync(resolve(path, f[0]), f[1]);
    } else {
      console.info(chalk`{${styles.green} +} {underline ${relativePath(root, resolve(path, f[0]))}}`);
      makeTemplate(root, resolve(path, f[0]), f[1]);
    }
  });
};

export type ProjectConfigs = {
  package: PackageConfig;
  typescript?: TSConfig;
  sass: boolean;
};

const initProject = (path: string, configs: ProjectConfigs) => {
  console.log('⏳ ' + chalk.cyan('Initialize project...'));
  createPkgJSON(path, configs.package);
  if (configs.typescript) {
    createTSConfig(path, configs.typescript);
  }
  // if is React
  makeTemplate(
    path,
    path,
    [
      ['app', [
        ['public', [
          // ['index.html', readFileSync(
          //   '../templates/index.html', { encoding: 'utf-8' }
          // ).replace("$NAME$", configs.package.name)],
          // ['manifest.json', readFileSync('../templates/manifest.json')],
          // ['favicon.ico', readFileSync('../templates/favicon.ico')],
          ['robots.txt', robotsTxt],
        ]],
        ['src', [
          ['components', []],
          ...((configs.typescript ? [['typings', [
            ['index.d.ts', '']
          ]]] : []) as [string, FileNode[]][]),
          ['views', []],
          ['utils', []],
          ['context', []],
          ['apis', []],
          // [`index.${
          //   configs.typescript ? 'tsx' : 'jsx'
          // }`, readFileSync('../templates/index.tsx')],
          // [`index.${
          //   configs.sass ? 'scss' : 'css'
          // }`, readFileSync('../templates/index.scss')]
        ]]
      ]],
      ['.gitignore', gitignore],
      // ['.eslintignore', readFileSync(resolve('../templates/.eslintignore'), { encoding: 'utf-8' })],
      // ['.eslintrc.js', readFileSync(resolve('../templates/.eslintrc.js'), { encoding: 'utf-8' })],
      ['README.md', `# ${configs.package.name}\n\n`]
    ]
  );
  console.info('🗸 ' + chalk.green`Created project template`);
};


export default initProject;
