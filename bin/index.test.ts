/*
 * @Author: Kanata You 
 * @Date: 2021-11-15 21:01:58 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-15 22:26:54
 */

import { describe, test, expect } from '@jest/globals';
import cli, { ExitCode } from './index';


describe('espoir/install', () => {
  test('espoir install', () => {
    expect(cli('install')).resolves.toBe(ExitCode.OK);
  });
});
