export declare enum ExitCode {
    OK = 0,
    OPERATION_FAILED = 1,
    UNDEFINED_BEHAVIOR = 2,
    UNCAUGHT_EXCEPTION = 3
}
declare const cli: (argv?: string[] | undefined) => Promise<ExitCode>;
export default cli;
