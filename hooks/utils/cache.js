/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 01:44:58 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-12 01:54:48
 */

const fs = require('fs');
const path = require('path');


const dir = path.resolve('temp');

const writeCache = (name, data) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(
    path.resolve(dir, name),
    data,
    { encoding: 'utf-8' }
  );
};

const readCache = name => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fn = path.resolve(dir, name);
  const data = fs.readFileSync(
    fn,
    { encoding: 'utf-8' }
  );

  fs.rmSync(fn);

  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }

  return data;
};


module.exports = {
  writeCache,
  readCache
};
