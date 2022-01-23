export interface EspoirTemplate {
    name: string;
    create: (name: string, enableTS: boolean) => Promise<void>;
}
export declare const getAllSupportedTemplates: () => EspoirTemplate[];
/**
 * Initialize a package with template.
 *
 * @param {string} name name of the new package
 * @param {boolean} enableTS
 * @param {string} template name of the template
 * @returns {Promise<boolean>} whether the operation succeeded
 */
declare const loadTemplate: (name: string, enableTS: boolean, template: string) => Promise<boolean>;
export default loadTemplate;
