import { PackageJSON } from '@env';
export declare type Dependency = {
    name: string;
    versions: string[];
};
export declare type SingleDependency = {
    name: string;
    version: string;
};
export declare type FailedDependency = SingleDependency & {
    reasons: Error[];
};
export declare type MinIncompatibleSet = SingleDependency[];
export declare type DependencyTag = ('dependencies' | 'devDependencies' | 'peerDependencies');
export declare type DependencySet = {
    [name: string]: string;
};
/**
 * Returns all the explicit dependencies.
 *
 * @param {PackageJSON} pkgJSON
 * @param {DependencyTag[]} keys
 * @returns {Dependency[]}
 */
export declare const getAllDependencies: (pkgJSON: PackageJSON, keys: DependencyTag[]) => Dependency[];
/**
 * Loads all the explicit dependencies from all `package.json`.
 */
declare const loadDependencies: (scopes: string[], isProd: boolean) => SingleDependency[];
export default loadDependencies;
