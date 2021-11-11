// / <reference types="node" />
export declare type FileNode = [string, string | Buffer] | [string, FileNode[]];
export declare const makeTemplate: (root: string, path: string, files: FileNode[]) => void;
