export declare type RepoPackageConfig = {
    name: string;
    version: string;
    contributors: string[];
    enableTS: boolean;
    template: string;
};
/**
 * Collect setup info of new monorepo.
 *
 * @returns {Promise<RepoPackageConfig>}
 */
declare const packageSetup: () => Promise<RepoPackageConfig>;
export default packageSetup;
