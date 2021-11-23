import { ExitCode } from '@src/index';
/**
 * Install modules and save as package dependencies.
 *
 * @param {string[]} modules
 * @param {string[]} scopes
 * @param {('dependencies' | 'devDependencies')} tag
 * @returns {Promise<ExitCode>}
 */
declare const installAndSave: (modules: string[], scopes: string[], tag: 'dependencies' | 'devDependencies') => Promise<ExitCode>;
export default installAndSave;
