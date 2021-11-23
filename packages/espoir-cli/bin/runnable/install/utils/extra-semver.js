"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-18 13:09:14
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-19 00:46:39
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coalesceVersions = exports.coalesce = void 0;

const semver = require("semver");

const coalesce = (prev, entering) => {
  if (semver.intersects(prev, entering)) {
    if (semver.subset(prev, entering)) {
      return prev;
    }

    if (semver.subset(entering, prev)) {
      return entering;
    }

    return semver.validRange(`${prev} ${entering}`);
  }

  return null;
};

exports.coalesce = coalesce;
/**
 * Gets the minimum incompatible set of the given ranges.
 */

const coalesceVersions = ranges => {
  if (ranges.length < 2) {
    return ranges.map(d => semver.validRange(d));
  }

  const fullSet = [...ranges];
  const results = [];
  fullSet.forEach(set => {
    for (let i = 0; i < results.length; i += 1) {
      const coalesced = (0, exports.coalesce)(results[i], set);

      if (coalesced) {
        // move the matched one, and insert the coalesced set, then break
        results.splice(i, 1, semver.validRange(coalesced));
        return;
      }
    } // no one matches


    results.push(semver.validRange(set));
  });
  return results;
};

exports.coalesceVersions = coalesceVersions;