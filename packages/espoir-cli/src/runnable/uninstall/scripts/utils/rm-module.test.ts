/*
 * @Author: Kanata You 
 * @Date: 2022-01-17 23:44:32 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-18 00:53:35
 */

import { describe, test, expect } from '@jest/globals';
import rmModules from './rm-module';


describe('uninstall/scripts/utils/rm-module.ts', () => {

  test('rmModules', () => {

    // nothing's gonna be deleted

    expect(
      rmModules({
        foo: {
          '1.2.3': {
            resolved: '...',
            target: '...',
            integrity: '...',
            requires: {}
          }
        }
      }, [{
        module: {
          name: 'foo',
          version: '1.2.3'
        },
        location: '...',
        packages: ['a'],
        required: [],
        requiring: {}
      }], 'a', [{
        name: 'bar',
        version: '*'
      }]).deleted.length
    ).toEqual(0);

    // remove one

    expect(
      rmModules({
        foo: {
          '1.2.3': {
            resolved: '...',
            target: '...',
            integrity: '...',
            requires: {}
          }
        }
      }, [{
        module: {
          name: 'foo',
          version: '1.2.3'
        },
        location: '...',
        packages: ['a'],
        required: [],
        requiring: {}
      }], 'a', [{
        name: 'foo',
        version: '*'
      }]).deleted.length
    ).toEqual(1);

    expect(
      rmModules({
        foo: {
          '1.2.3': {
            resolved: '...',
            target: '...',
            integrity: '...',
            requires: {}
          }
        }
      }, [{
        module: {
          name: 'foo',
          version: '1.2.3'
        },
        location: '...',
        packages: ['a'],
        required: [],
        requiring: {}
      }], 'a', [{
        name: 'foo',
        version: '*'
      }]).lockData
    ).toEqual({});

  });

});
