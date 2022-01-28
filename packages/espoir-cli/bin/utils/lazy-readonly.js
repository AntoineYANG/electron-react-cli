"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-28 13:52:44
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:31:56
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazyUpdate = void 0;
exports.lazyUpdate = Symbol('lazyReadonly.update');
/**
 * Creates a readonly object with all entries uninitialized,
 * value of each entry will be initialized at the first time when it'll be got.
 * @template T
 * @template Context
 * @param {({ [key in keyof (Context & T)]: (obj: Readonly<T & Context>) => (Context & T)[key] })} getters
 * @returns {Readonly<T & {[lazyUpdate]: (keys: (keyof T)[]) => void}>}
 */

const lazyReadonly = getters => {
  const target = {
    [exports.lazyUpdate]: keys => {
      for (const key of keys) {
        if (key in getters) {
          target[key] = getters[key](target);
        }
      }
    }
  };

  let useProxy = () => target;

  const proxy = new Proxy(target, {
    get: (_, key) => {
      if (key === exports.lazyUpdate) {
        return target[exports.lazyUpdate];
      }

      if (key in getters) {
        if (!(key in target)) {
          target[key] = getters[key](useProxy());
        }

        return target[key];
      }

      return undefined;
    }
  });

  useProxy = () => proxy;

  return proxy;
};

exports.default = lazyReadonly;