/*
 * @Author: Kanata You
 * @Date: 2021-11-11 02:37:27
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 03:14:23
 */

/* eslint-disable no-magic-numbers */

/**
 * Formats time string.
 *
 * @param {number} time
 */
const formattedTime = time => (time >= 200 ? `${(time / 1000).toFixed(3).replace(/0+$/, '')}s` : `${time}ms`);

/**
 * Formats file size string.
 *
 * @param {number} size
 */
const formattedSize = size => (size >= 900 ? `${(size / 1024).toFixed(2).replace(/0+$/, '')}K` : `${size}B`);

module.exports = {
  formattedTime,
  formattedSize,
};
