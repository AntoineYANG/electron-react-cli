/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:16:13 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-14 00:57:38
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');

const env = require('../utils/env.js');
const { DependentSource, getAllDependencies } = require('../utils/dependencies.js');
const installModule = require('../utils/install-module.js');


const argv = process.argv.slice(3);

/** @type {import('./node-package.d').InstallOptions} */
const options = {
  isProd: argv.includes('--production'),
  where:  env.resolvePath(
    '.espoir',
    'download'
  ),
  shell:   process.platform === 'win32' ? (process.env.ComSpec || 'cmd') : (process.env.SHELL || 'sh'),
  args:    argv,
  configs: {
    registry: (() => {
      try {
        return execSync('npm config get registry', { encoding: 'utf-8' }).replace(/\n$/, '');
      } catch {
        return 'https://registry.npmjs.org/';
      }
    })(),
    ignoreMissing: true
  },
  node: {
    version: process.version
  }
};

/**
 * Installs all dependencies into the root dir.
 */
const install = async () => {
  const deps = getAllDependencies(options);
  process.exit(-1);

  /** @type {ReturnType<typeof installModule>[]} */
  const tasks = [];
  /** @type {string[]} */
  const names = [];

  if (!options.isProd) {
    Object.entries(deps.devDependencies).forEach(([name, list]) => {
      list.forEach(d => {
        names.push(name);
        tasks.push(
          installModule(name, d.to, options)
        );
      });
    });
  }

  fs.rmSync(
    options.where,
    {
      recursive: true,
      force:     true
    }
  );

  const results = await Promise.allSettled(tasks);

  console.log('Install completed');
  console.log(
    chalk`{greenBright \u2714  ${results.filter(r => r.value).length}} dependencies installed`
  );

  if (results.filter(r => r.reason).length) {
    console.log(
      chalk`{redBright \u2716  ${results.filter(r => r.reason).length}} dependencies failed`
    );
    results.forEach((r, i) => {
      if (r.reason) {
        console.log(
          chalk`{redBright \u2716 } {blue.bold ${names[i]}}`
        );
        console.error(r.reason);
      }
    });
  }

  return -1;
};


module.exports = install;
