export interface LocalScript {
    name: string;
    cmd: string;
    cwd: string;
}
/**
 * Gets all runnable scripts.
 *
 * @param {string} [scope]
 * @returns {RunnableScript[]}
 */
declare const getRunnableScripts: (scope?: string | undefined) => LocalScript[];
export default getRunnableScripts;
