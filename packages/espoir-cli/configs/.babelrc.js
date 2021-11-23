/*
 * @Author: Kanata You 
 * @Date: 2021-11-15 22:30:12 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-24 00:55:46
 */

const path = require('path');
const tsConfig = require('../tsconfig.json');

const getAliases = () => {
  const aliases = {};

  Object.entries(tsConfig.compilerOptions.paths ?? {}).forEach(([k, v]) => {
    aliases[k.replace(/\/\*$/, '')] = (
      v[0].replace(/^\.\//, '').replace(/\/?\*$/, '') || '.'
    );
  });

  return aliases;
};

module.exports = {
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: [
          path.join('.', tsConfig.compilerOptions.outDir)
        ],
        alias: getAliases()
      }
    ]
  ]
};