import type { RepoPackageConfig } from './package-setup';
import { PackageJSON } from '@env';
declare const createPackage: (config: RepoPackageConfig) => Promise<PackageJSON>;
export default createPackage;
