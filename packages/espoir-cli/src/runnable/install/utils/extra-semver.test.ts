/*
 * @Author: Kanata You 
 * @Date: 2021-11-18 21:54:08 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-18 00:08:28
 */

import { describe, test, expect } from '@jest/globals';
import { coalesceVersions } from './extra-semver';


describe('install/utils/extra-semver', () => {

  test('coalesceVersions', () => {
    expect(
      coalesceVersions([])
    ).toEqual([]);

    expect(
      coalesceVersions(['*'])
    ).toEqual(['*']);

    expect(
      coalesceVersions(['3.2.1'])
    ).toEqual(['3.2.1']);

    expect(
      coalesceVersions(['4.2.1 - 5.4.0'])
    ).toEqual(['>=4.2.1 <=5.4.0']);

    expect(
      coalesceVersions(['^4.1.2'])
    ).toEqual(['>=4.1.2 <5.0.0-0']);

    expect(
      coalesceVersions(['^0.2.7'])
    ).toEqual(['>=0.2.7 <0.3.0-0']);

    expect(
      coalesceVersions(['>3.2.10'])
    ).toEqual(['>3.2.10']);

    expect(
      coalesceVersions(['>=2.7.1'])
    ).toEqual(['>=2.7.1']);

    expect(
      coalesceVersions(['<1.8.4'])
    ).toEqual(['<1.8.4']);

    expect(
      coalesceVersions(['<=7.5.2'])
    ).toEqual(['<=7.5.2']);

    expect(
      coalesceVersions(['*', '2.5.6'])
    ).toEqual(['2.5.6']);

    expect(
      coalesceVersions(['2.4.3', '3.0.6', '*'])
    ).toEqual(['2.4.3', '3.0.6']);

    expect(
      coalesceVersions(['2.11.0', '2.11.0'])
    ).toEqual(['2.11.0']);

    expect(
      coalesceVersions(['>2.1.0', '2.6.2'])
    ).toEqual(['2.6.2']);

    expect(
      coalesceVersions(['2.1.0', '^2.6.2'])
    ).toEqual(['2.1.0', '>=2.6.2 <3.0.0-0']);

    expect(
      coalesceVersions(['>2.1.0', '<=1.0.10'])
    ).toEqual(['>2.1.0', '<=1.0.10']);

    expect(
      coalesceVersions(['>2.1.0', '>=2.2.10', '<1.0.10'])
    ).toEqual(['>=2.2.10', '<1.0.10']);

    expect(
      coalesceVersions(['>=4.2.1', '<=5.4.0'])
    ).toEqual(['>=4.2.1 <=5.4.0']);

    expect(
      coalesceVersions(['>4.2.2', '<5.4.0'])
    ).toEqual(['>4.2.2 <5.4.0']);

    expect(
      coalesceVersions(['^5.2.3', '<5.4.0'])
    ).toEqual(['>=5.2.3 <6.0.0-0 <5.4.0']);

    expect(
      coalesceVersions(['^1.2.3', '<5.4.0'])
    ).toEqual(['>=1.2.3 <2.0.0-0']);

    expect(
      coalesceVersions(['^0.2.3', '0.3.1'])
    ).toEqual(['>=0.2.3 <0.3.0-0', '0.3.1']);

    expect(
      coalesceVersions(['^2.1.0', '>2.0.0'])
    ).toEqual(['>=2.1.0 <3.0.0-0']);
  });
});
