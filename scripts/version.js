/*
 * @Author: Kanata You 
 * @Date: 2021-11-09 12:33:47 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 14:46:21
 */

const pkgJSON = require('../package.json');
const { writeFileSync, readFileSync } = require('fs');


const prevVersion = (
  /^(?<X>\d+)\.(?<Y>\d+)\.(?<Z>\d+)(\-(?<test>(alpha|beta))\-(?<x>\d+)\.(?<y>\d+)\.(?<z>\d+))?$/
).exec(pkgJSON.version).groups;

Object.entries(prevVersion).forEach(([k, v]) => {
  if (/[XYZ]/i.test(k)) {
    prevVersion[k] = parseInt(v);
  }
});

const formattedVersion = (X, Y, Z, test = undefined, x = undefined, y = undefined, z = undefined) => {
  return `${X}.${Y}.${Z}${
    test ? (
      `-${test}-${x}.${y}.${z}`
    ) : ''
  }`;
};

const main = (vt = 'alpha') => {
  const op = {
    alpha() {
      const nextVersion = formattedVersion(
        prevVersion.X,
        prevVersion.test === 'alpha' ? prevVersion.Y : (prevVersion.Y + 1),
        prevVersion.Z,
        'alpha',
        prevVersion.test === 'alpha' && prevVersion.x !== undefined ? prevVersion.x : 1,
        prevVersion.test === 'alpha' && prevVersion.y !== undefined ? (prevVersion.y + 1) : 0,
        0
      );
      return nextVersion;
    }
  }[vt] ?? (() => {
    const err = new Error(`Unknown type: ${vt}`);
    console.error(err);
    throw err;
  });
  const nv = op();
  console.info(`Version set to ${nv}`);
  const data = JSON.stringify({
    ...pkgJSON,
    version: nv
  }, undefined, 2);
  writeFileSync('./package.json', data);
  writeFileSync('./output/package.json', JSON.stringify({
    ...pkgJSON,
    version: nv,
    type: 'module',
    bin: {
      espoir: './bin/index.js'
    }
  }, undefined, 2));
  writeFileSync('./output/README.md', readFileSync('./README.md', { encoding: 'utf-8' }));
};

main(process.argv[2]);
