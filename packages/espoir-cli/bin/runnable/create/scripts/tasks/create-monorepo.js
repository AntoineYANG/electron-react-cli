"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 19:48:51
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:33:03
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const path = require("path");

const mkdirp_1 = require("mkdirp");

const _env_1 = require("../../../../utils/env");

const createMonorepo = config => {
  (0, mkdirp_1.sync)(config.name);
  (0, mkdirp_1.sync)(path.join(config.name, 'packages'));
  (0, mkdirp_1.sync)(path.join(config.name, 'configs'));
  (0, mkdirp_1.sync)(path.join(config.name, 'scripts'));
  (0, mkdirp_1.sync)(path.join(config.name, 'tasks'));
  fs.writeFileSync(path.join(config.name, '.gitignore'), `# Logs
logs
*.log

# Dependency directories
node_modules/

# Espoir cache
.espoir/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
`, {
    encoding: 'utf-8'
  });
  fs.writeFileSync(path.join(config.name, 'espoir.config.json'), `{
  "commit": {
    "types": [
      "feature",
      "bugfix",
      "refactor",
      "performance",
      "chore"
    ]
  }
}`, {
    encoding: 'utf-8'
  });
  fs.writeFileSync(path.join(config.name, 'README.md'), `# ${config.name}\n\n`, {
    encoding: 'utf-8'
  });
  fs.writeFileSync(path.join(config.name, 'package.json'), JSON.stringify({
    private: true,
    workspaces: ['packages/*'],
    espoirVersion: _env_1.default.version,
    contributors: config.contributors,
    repository: config.git ? {
      type: 'git',
      url: config.git
    } : undefined,
    bugs: config.git ? {
      url: config.git.replace(/\.git$/, '/issues')
    } : undefined,
    homepage: config.git ? config.git.replace(/\.git$/, '/README.md') : undefined,
    scripts: {},
    devDependencies: {},
    peerDependencies: {
      'espoir-cli': `^${_env_1.default.runtime.espoir.version}`
    }
  }, undefined, 2) + '\n', {
    encoding: 'utf-8'
  });

  if (config.enableTS) {
    fs.writeFileSync(path.join(config.name, 'tsconfig.base.json'), JSON.stringify({
      compilerOptions: {
        baseUrl: './',
        module: 'CommonJS',
        moduleResolution: 'Node',
        paths: {},
        declaration: true,
        preserveConstEnums: true,
        removeComments: false,
        sourceMap: true,
        allowJs: false,
        resolveJsonModule: true,
        target: 'ES5',
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
        useUnknownInCatchVariables: false
      }
    }, undefined, 2) + '\n', {
      encoding: 'utf-8'
    });
  }
};

exports.default = createMonorepo;