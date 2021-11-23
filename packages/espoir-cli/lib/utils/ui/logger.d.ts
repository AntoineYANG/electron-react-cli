export declare enum LogLevel {
    NONE = "",
    ERROR = "error",
    ERROR_WARNING = "error|warning",
    ALL = "error|warning|info"
}
export declare class StopWatch {
    readonly label: string;
    readonly beginTime: number;
    readonly endTime: Promise<number>;
    private _ms;
    get ms(): number;
    readonly finalCost: Promise<number>;
    private resolvers;
    constructor(label: string);
    stop(): number;
}
/**
 * Logging methods.
 *
 * @abstract
 * @class Logger
 */
declare abstract class Logger {
    static level: LogLevel;
    static get path(): string;
    private static saveLog;
    static log(msg: string): void;
    static info(...msgs: any[]): boolean;
    static warn(...msgs: any[]): boolean;
    static error(...msgs: any[]): boolean;
    static logError(err: Error): boolean;
    static startStopWatch(label: string): StopWatch;
    static stopStopWatch(sw: StopWatch): number;
    static writeCanOverwrite(content: string): void;
    static clearRow(): void;
}
export default Logger;
