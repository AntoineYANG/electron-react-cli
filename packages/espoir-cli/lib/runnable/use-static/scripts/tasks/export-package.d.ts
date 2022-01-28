import type { ListrTask, ListrRendererFactory } from 'listr2';
declare const exportPackage: (name: string) => ListrTask<{}, ListrRendererFactory>;
export default exportPackage;
