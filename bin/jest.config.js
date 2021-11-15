/*
 * @Author: Kanata You 
 * @Date: 2021-11-15 20:34:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 22:37:09
 */
'use strict';

const { defaults } = require('jest-config');


/** @type {typeof defaults} */
const config = {
  ...defaults,
  detectOpenHandles: true,
  displayName: {
    name: 'bin',
    color: 'rgb(221,122,125)'
  },
  testRegex: '\.test\.(tsx?)$',
  testMatch: undefined
};


module.exports = config;
