export declare type MonorepoConfig = {
    name: string;
    contributors: string[];
    git: string | undefined;
    packages: [];
    enableTS: boolean;
};
/**
 * Collect setup info of new monorepo.
 *
 * @returns {Promise<MonorepoConfig>}
 */
declare const monorepoSetup: () => Promise<MonorepoConfig>;
export default monorepoSetup;
