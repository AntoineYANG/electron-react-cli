/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 13:30:38 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-08 21:54:56
 */

const { readFileSync, writeFileSync } = require('fs');
const readDirAll = require('./read-dir-all.js');


class WritableFile {

  constructor(fn) {
    this._path = fn;
  }

  /**
   * Replace contents in the file.
   *
   * @param {((search: RegExp) | (replacer: (origin: string, groups: Record<string, string>) => string | false))[]} rules
   * @memberof WritableFile
   */
  replaceAll(...all) {
    for (let i = 0; i * 2 + 1 < all.length; i += 1) {
      const _search = all[i * 2];
      const _replacer = all[i * 2 + 1];

      let temp = this.text;
      let data = '';

      let cs = new RegExp(_search, 'g').exec(temp);

      if (cs === null) {
        continue;
      }
      while (cs) {
        const origin = cs[0];
        const groups = cs.groups ?? {};
        const il = temp.search(origin);
        const ir = il + origin.length;
        const before = temp.substring(0, il);
        data += before;
        const end = temp.substring(ir);
        temp = end;
        const value = _replacer(origin, groups);

        if (value !== false) {
          data += value;
        } else {
          data += origin;
        }
        cs = new RegExp(_search, 'g').exec(temp);
      }
      this.text = data + temp;
    }
  }

  get text() {
    return readFileSync(this._path, { encoding: 'utf-8' });
  }

  set text(data) {
    writeFileSync(this._path, data);
  }

}

class WritableFileSet {
  
  /**
   *Creates an instance of WritableFileSet.
   * @param {string[]} fns
   * @memberof WritableFileSet
   */
  constructor(fns) {
    this._paths = [...fns];
    this._files = fns.map(fn => new WritableFile(fn));
  }

  /**
   * @param {Parameters<(string [])['filter']>[0]} predicate
   */
  filter(predicate) {
    return new WritableFileSet(this._paths.filter(predicate));
  }
  
  /**
   * Replace contents in all the files.
   *
   * @param {((search: RegExp) | (replacer: (origin: string, groups: Record<string, string>) => string | false))[]} rules
   * @memberof WritableFile
   */
  replaceAll(...rules) {
    this._files.forEach(wf => {
      wf.replaceAll(...rules);
    });
    return this;
  }

}

const forEachFile = (path, filter) => new WritableFileSet(readDirAll(path, filter));


module.exports = forEachFile;
