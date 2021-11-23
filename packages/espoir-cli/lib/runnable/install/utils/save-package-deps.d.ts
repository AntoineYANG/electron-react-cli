import { SingleDependency } from './load-dependencies';
export declare type DependencyTag = ('dependencies' | 'devDependencies');
declare const savePackageDeps: (deps: SingleDependency[], scopes: string[], tag: 'dependencies' | 'devDependencies') => void;
export default savePackageDeps;
