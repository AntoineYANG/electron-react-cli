/*
 * @Author: Kanata You
 * @Date: 2021-11-04 19:07:13
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 21:22:30
 */
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(resolve => {
      resolve(value); 
    }); 
  }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) {
      try {
        step(generator.next(value)); 
      } catch (e) {
        reject(e); 
      } 
    }

    function rejected(value) {
      try {
        step(generator.throw(value)); 
      } catch (e) {
        reject(e); 
      } 
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); 
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, readdirSync, rmdirSync, writeFileSync } from 'fs';
import { makeTemplate } from './extra-fs.js';
import styles from './styles.js';
import { installAll } from './dependencies.js';
import eslintIgnore from '../templates/eslintignore.js';
import eslintRc from '../templates/eslintrc.js';
import robotsTxt from '../templates/robots_txt.js';
import gitignore from '../templates/gitignore.js';

const createPkgJSON = (path, config) => {
  const data = {
    name:        config.name,
    version:     config.version,
    description: config.description,
    author:      config.author,
    // "main": "index.js",
    // "scripts": {
    //   "build": "node --experimental-json-modules ./scripts/build",
    //   "test:create": "npm run build & node ./build/index.js create app"
    // },
    repository:  config.git ? {
      type: 'git',
      url:  `git+ssh://${config.git}`
    } : undefined,
    keywords: config.keywords,
    license:  config.license,
    bugs:     config.git ? {
      url: `https://github.com/${/^git@github.com:(?<addr>.+)\.git$/.exec(config.git).groups.addr}/issues`
    } : undefined,
    homepage: config.git ? `https://github.com/${/^git@github.com:(?<addr>.+)\.git$/.exec(config.git).groups.addr}#readme` : undefined,
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

  try {
    writeFileSync(resolve(path, 'package.json'), JSON.stringify(data, undefined, 2));
  } catch (error) {
    console.error(error);
  }
  console.info(chalk`{${styles.greenBright} 🗸  Created {underline package.json } }`);
};

const createTSConfig = (path, config) => {
  const data = {
    compilerOptions: {
      target:                           config.target,
      lib:                              ['dom', 'dom.iterable', 'esnext'],
      allowJs:                          config.allowJS,
      skipLibCheck:                     true,
      esModuleInterop:                  true,
      allowSyntheticDefaultImports:     true,
      strict:                           true,
      forceConsistentCasingInFileNames: true,
      noFallthroughCasesInSwitch:       true,
      module:                           config.module,
      moduleResolution:                 'node',
      resolveJsonModule:                true,
      isolatedModules:                  true,
      sourceMap:                        true,
      noEmit:                           !config.emit,
      baseUrl:                          '.',
      paths:                            {},
      outDir:                           config.emit ? 'build' : undefined
    },
    include: ['src/*'],
    exclude: ['node_modules/**/*']
  };
  writeFileSync(resolve(path, 'tsconfig.json'), JSON.stringify(data, undefined, 2));
  console.info(chalk`{${styles.greenBright} 🗸  Created {underline tsconfig.json } }`);
};
const initProject = (path, configs) => __awaiter(void 0, void 0, void 0, function *() {
  if (existsSync(path)) {
    if (readdirSync(path).length) {
      console.info(chalk`{${styles.red} ERROR: directory {underline ${path}} is not empty}\n`
                + chalk`Remove it or use another directory instead\n`);
      const err = new Error(`ERROR: directory ${styles.red} is not empty`);
      throw err;
    } else {
      rmdirSync(path);
    }
  }
  console.clear();
  console.log(`⏳ ${chalk`{${styles.cyan} Initialize project...}`}`);
  const dependencies = [];
  const devDependencies = [];

  if (configs.eslint) {
    devDependencies.push(...[
      'eslint',
      'eslint-config-react-app',
      'eslint-plugin-flowtype',
      'eslint-plugin-import',
      'eslint-plugin-jest',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-testing-library',
      'eslint-webpack-plugin'
    ].filter(Boolean).map(name => ({
      name
    })));
    makeTemplate(path, path, [
      ['app', []],
      ['.gitignore', gitignore],
      ['.eslintignore', eslintIgnore],
      ['.eslintrc.js', eslintRc],
      ['README.md', `# ${configs.package.name}\n\n`]
    ]);
  } else {
    makeTemplate(path, path, [['app', []], ['.gitignore', gitignore], ['README.md', `# ${configs.package.name}\n\n`]]);
  }
  createPkgJSON(path, configs.package);

  if (configs.typescript) {
    devDependencies.push({ name: 'typescript' });
    createTSConfig(path, configs.typescript);
  }
  if (configs.sass) {
    dependencies.push({ name: 'sass' });
  }
  if (configs.mode === 'react') {
    // if is React
    makeTemplate(path, path, [
      [
        'app',
        [
          [
            'public',
            [
              // ['index.html', readFileSync(
              //   '../templates/index.html', { encoding: 'utf-8' }
              // ).replace("$NAME$", configs.package.name)],
              // ['manifest.json', readFileSync('../templates/manifest.json')],
              // ['favicon.ico', readFileSync('../templates/favicon.ico')],
              ['robots.txt', robotsTxt],
            ]
          ],
          [
            'src',
            [
              ['components', []],
              ...(configs.typescript ? [['typings', [['index.d.ts', '']]]] : []),
              ['views', []],
              ['utils', []],
              ['context', []],
              ['api', []],
              // [`index.${
              //   configs.typescript ? 'tsx' : 'jsx'
              // }`, readFileSync('../templates/index.tsx')],
              // [`index.${
              //   configs.sass ? 'scss' : 'css'
              // }`, readFileSync('../templates/index.scss')]
            ]
          ]
        ]
      ]
    ]);
  }
  console.info(chalk`{${styles.greenBright} 🗸  Created project template }`);
  console.log();
  console.log(`⏳ ${chalk`{${styles.cyan} Installing dependencies...}`}`);
  yield installAll(path, [...dependencies, ...devDependencies.map(d => (Object.assign(Object.assign({}, d), { flag: 'dev' })))]);
});
export default initProject;
// # sourceMappingURL=init.js.map
