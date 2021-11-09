import readline from 'readline';
import type { PropertySchema } from './require-input';
export declare const requireStringInput: (name: string, defaultValue: string, schema: PropertySchema, rl: readline.Interface) => Promise<string | undefined>;
export declare const requireBooleanInput: (name: string, defaultValue: boolean, schema: PropertySchema, rl: readline.Interface) => Promise<boolean>;
export declare const requireOptionInput: (name: string, options: string[], schema: PropertySchema) => Promise<string>;
export declare const requireCheckBoxInput: (name: string, options: [string, boolean, string?][], schema: PropertySchema) => Promise<Record<string, boolean>>;
