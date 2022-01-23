/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

/**
 * Initialize Node env before webpack
 * @param {'dev' | 'prod'} env
 */
const init = env => {
  const ENV = {
    d:           'development',
    dev:         'development',
    development: 'development',
    p:           'production',
    prod:        'production',
    product:     'production',
    production:  'production'
  }[env.toLocaleLowerCase()] ?? 'development';
  process.env.BABEL_ENV = ENV;
  process.env.NODE_ENV = ENV;
  const appDirectory = fs.realpathSync(process.cwd());
  process.env.NODE_PATH = (process.env.NODE_PATH || '').
    split(path.delimiter).
    filter(folder => folder && !path.isAbsolute(folder)).
    map(folder => path.resolve(appDirectory, folder)).
    join(path.delimiter);

  process.on('unhandledRejection', err => {
    throw err;
  });

  return { ...process.env };
};

module.exports = init;
