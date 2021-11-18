"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-12 15:19:20
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-17 20:26:47
 */
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitCode = void 0;
var chalk = require("chalk");
var install_1 = require("./runnable/install");
var logger_1 = require("./utils/ui/logger");
var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["OPERATION_NOT_FOUND"] = -2] = "OPERATION_NOT_FOUND";
    ExitCode[ExitCode["BAD_PARAMS"] = -1] = "BAD_PARAMS";
    ExitCode[ExitCode["OK"] = 0] = "OK";
    ExitCode[ExitCode["OPERATION_FAILED"] = 1] = "OPERATION_FAILED";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
;
var supportedCommand = [
    install_1.default
];
var main = function (script, args) { return __awaiter(void 0, void 0, void 0, function () {
    var originTitle, code, Task, task, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                originTitle = process.title;
                code = ExitCode.OPERATION_NOT_FOUND;
                Task = supportedCommand.find(function (cmd) {
                    return cmd.fullName === script || cmd.aliases.includes(script);
                });
                if (!Task) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                task = new Task(args);
                process.title = "espoir script [".concat(Task.displayName, "]");
                return [4 /*yield*/, task.exec()];
            case 2:
                code = _a.sent();
                if (code !== ExitCode.OK) {
                    logger_1.default.error(chalk(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{redBright {bold \u2716 } {blue.underline [", "]} failed with code {yellow.bold ", "}.}"], ["{redBright {bold \\u2716 } {blue.underline [", "]} failed with code {yellow.bold ", "}.}"])), Task.displayName, code));
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                if (err_1.name === 'OptionParseError') {
                    logger_1.default.error(err_1.message);
                    code = ExitCode.BAD_PARAMS;
                }
                else {
                    throw err_1;
                }
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                logger_1.default.error(chalk(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{redBright {bold \u2716 } Script \"{blue.underline ", "}\" is not found.}"], ["{redBright {bold \\u2716 } Script \"{blue.underline ", "}\" is not found.}"])), script));
                _a.label = 6;
            case 6:
                process.title = originTitle;
                return [2 /*return*/, code];
        }
    });
}); };
var cli = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var returnCode;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, main((_a = args[0]) !== null && _a !== void 0 ? _a : '', args.slice(1))];
                case 1:
                    returnCode = _b.sent();
                    return [2 /*return*/, returnCode];
            }
        });
    });
};
if (require.main === module) {
    cli.apply(void 0, process.argv.slice(2)).then(process.exit);
}
exports.default = cli;
var templateObject_1, templateObject_2;
