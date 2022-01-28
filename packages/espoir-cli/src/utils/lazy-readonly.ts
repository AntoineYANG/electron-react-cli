/*
 * @Author: Kanata You 
 * @Date: 2022-01-28 13:52:44 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-28 15:31:56
 */

export const lazyUpdate: unique symbol = Symbol('lazyReadonly.update');

/**
 * Creates a readonly object with all entries uninitialized,
 * value of each entry will be initialized at the first time when it'll be got.
 * @template T
 * @template Context
 * @param {({ [key in keyof (Context & T)]: (obj: Readonly<T & Context>) => (Context & T)[key] })} getters
 * @returns {Readonly<T & {[lazyUpdate]: (keys: (keyof T)[]) => void}>}
 */
const lazyReadonly = <
  T extends Record<string | number | symbol, any>,
  Context extends Record<string | number | symbol, any> = T
>(
  getters: { [key in keyof (Context & T)]: (obj: Readonly<T & Context>) => (Context & T)[key] }
): Readonly<
  T & {
    [lazyUpdate]: (keys: (keyof T)[]) => void;
  }
> => {
  const target = {
    [lazyUpdate]: (keys: (keyof T)[]) => {
      for (const key of keys) {
        if (key in getters) {
          (target as T & Context)[key as keyof T & Context] = getters[key as keyof T & Context](
            target as T & Context
          );
        }
      }
    }
  } as (T & Context & {
    [lazyUpdate]: (keys: (keyof T)[]) => void;
  });

  let useProxy: () => Readonly<T & Context> = () => target;

  const proxy = new Proxy<
    T & Context & {
      [lazyUpdate]: (keys: (keyof T)[]) => void;
    }
  >(
    target, {
      get: (_, key) => {
        if (key === lazyUpdate) {
          return target[lazyUpdate];
        }
        
        if (key in getters) {
          if (!(key in target)) {
            (target as T & Context)[key as keyof T & Context] = getters[key as keyof T & Context](
              useProxy()
            );
          }

          return target[key];
        }

        return undefined;
      }
    }
  );

  useProxy = () => proxy;

  return proxy;
};


export default lazyReadonly;
