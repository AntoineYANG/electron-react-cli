"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-16 01:05:00
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 21:40:53
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTag = void 0;
var chalk = require("chalk");
var ProgressTag;
(function (ProgressTag) {
    ProgressTag[ProgressTag["prepare"] = 0] = "prepare";
    ProgressTag[ProgressTag["download"] = 1] = "download";
    ProgressTag[ProgressTag["un-compress"] = 2] = "un-compress";
    ProgressTag[ProgressTag["unpack"] = 3] = "unpack";
    ProgressTag[ProgressTag["done"] = 10] = "done";
    ProgressTag[ProgressTag["failed"] = -1] = "failed";
})(ProgressTag = exports.ProgressTag || (exports.ProgressTag = {}));
var desc = (_a = {
        0: chalk.blue.bold(templateObject_1 || (templateObject_1 = __makeTemplateObject(["[Preparing]"], ["[Preparing]"]))),
        1: chalk.yellow.bold(templateObject_2 || (templateObject_2 = __makeTemplateObject(["[Downloading]"], ["[Downloading]"]))),
        2: chalk.magenta.bold(templateObject_3 || (templateObject_3 = __makeTemplateObject(["[Un-compressing]"], ["[Un-compressing]"]))),
        3: chalk.magentaBright.bold(templateObject_4 || (templateObject_4 = __makeTemplateObject(["[Unpacking]"], ["[Unpacking]"]))),
        10: chalk.greenBright.bold(templateObject_5 || (templateObject_5 = __makeTemplateObject(["[Completed]"], ["[Completed]"])))
    },
    _a[-1] = chalk.red.bold(templateObject_6 || (templateObject_6 = __makeTemplateObject(["[Failed]"], ["[Failed]"]))),
    _a);
var tasks = [];
var NAME_LEN = 30;
var STAGE_LEN = 14;
/**
 * Updates progress of a task.
 *
 * @param {string} name the installing package
 * @param {ProgressTag} task label of the stage
 * @param {number} p progress of this stage, (0, 1) or -1 if the rate is meaningless
 * @returns {Promise<void>}
 */
var setProgress = function (name, task, p) { return __awaiter(void 0, void 0, void 0, function () {
    var idx, item;
    return __generator(this, function (_a) {
        idx = tasks.map(function (t) { return t[0]; }).indexOf(name);
        if (idx === -1 && ![ProgressTag.done, ProgressTag.failed].includes(task)) {
            tasks.push([name, task, p]);
        }
        else if (tasks[idx]) {
            item = tasks[idx];
            item[1] = task;
            item[2] = p;
        }
        return [2 /*return*/];
    });
}); };
var stringify = function (name, tag, value) {
    var _name = name.slice(0, NAME_LEN);
    var leftSpan = ' '.repeat(NAME_LEN - _name.length + 2);
    var stage = desc[tag].slice(0, STAGE_LEN) + 2;
    var rightSpan = ' '.repeat(STAGE_LEN - stage.length + 2);
    var p = (value && value >= 0 && value <= 1 && ![ProgressTag.done, ProgressTag.failed].includes(tag)) ? chalk.green(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", "% "], ["", "% "])), (value * 100).toFixed(2)) : '';
    return ("" + leftSpan + chalk.green.bold(_name + ' ') + desc[tag] + rightSpan + " " + p + ' '.repeat(10));
};
var progress = {
    set: setProgress,
    stringify: stringify
};
exports.default = progress;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
