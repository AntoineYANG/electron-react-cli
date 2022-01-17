/*
 * @Author: Kanata You 
 * @Date: 2021-11-15 20:34:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-18 00:33:07
 */
'use strict';

const { defaults } = require('jest-config');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');


/** @type {typeof defaults} */
const config = {
  ...defaults,
  preset: 'ts-jest',
  detectOpenHandles: true,
  displayName: {
    name: 'espoir-cli',
    color: 'rgb(221,122,125)'
  },
  testRegex: '.+\.test\.tsx?$',
  testMatch: undefined,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
};


module.exports = config;
