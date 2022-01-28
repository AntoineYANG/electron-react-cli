export declare const lazyUpdate: unique symbol;
/**
 * Creates a readonly object with all entries uninitialized,
 * value of each entry will be initialized at the first time when it'll be got.
 * @template T
 * @template Context
 * @param {({ [key in keyof (Context & T)]: (obj: Readonly<T & Context>) => (Context & T)[key] })} getters
 * @returns {Readonly<T & {[lazyUpdate]: (keys: (keyof T)[]) => void}>}
 */
declare const lazyReadonly: <T extends Record<string | number | symbol, any>, Context extends Record<string | number | symbol, any> = T>(getters: { [key in keyof (Context & T)]: (obj: Readonly<T & Context>) => (Context & T)[key]; }) => Readonly<T & {
    [lazyUpdate]: (keys: (keyof T)[]) => void;
}>;
export default lazyReadonly;
