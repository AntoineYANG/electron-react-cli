export declare enum ProgressTag {
    prepare = 0,
    download = 1,
    'un-compress' = 2,
    unpack = 3,
    done = 10,
    failed = -1
}
declare const progress: {
    set: (name: string, task: ProgressTag, p: number) => Promise<void>;
    stringify: (name: string, tag: ProgressTag, value?: number) => string;
};
export default progress;
