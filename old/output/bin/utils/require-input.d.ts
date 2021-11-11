export declare type PropertySchema = {
    type?: 'boolean' | 'option' | 'checkbox';
    /** If defined, the param will appear only when the situation is satisfied */
    onlyIf?: (temp: any) => boolean;
    /** Display name */
    alias?: string;
    /** If true, the value should not be undefined */
    required?: boolean;
    /** The expected value regex needs to be satisfied by the value */
    pattern?: RegExp;
    /** Tells if the value is valid */
    checker?: (value: string | Record<string, boolean>) => boolean;
    /** Description for this object */
    desc?: string;
    /** Displays when input is not valid */
    tips?: (input: string) => string;
    /** The array of expected values */
    options?: [string, boolean, string?][] | string[];
    /** Default value */
    defaultValue?: any;
};
export declare type Properties = {
    [name: string]: PropertySchema;
};
declare type ExpectedValue<P extends Properties> = {
    [name in keyof P]?: any | undefined;
};
declare const requireInput: <P extends Properties>(properties: P, retell?: boolean) => Promise<ExpectedValue<P>>;
export default requireInput;
