import type { VersionInfo } from '@request/request-npm';
declare const diffLocal: (dependencies: VersionInfo[]) => Promise<VersionInfo[]>;
export default diffLocal;
