"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-14 18:13:35
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 01:23:52
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = exports.StatusCode = void 0;
var fs = require("fs");
var path = require("path");
var mkdirp_1 = require("mkdirp");
var needle = require("needle");
var npm = require("./request-npm");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["ok"] = 200] = "ok";
    StatusCode[StatusCode["redirected"] = 302] = "redirected";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
var defaultOptions = {
    memo: false,
    cache: false,
    expiresSpan: 1000 * 60 * 60 * 24,
    timeout: 5000,
    maxRedirect: 1
};
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = 'RequestError';
        return _this;
    }
    return RequestError;
}(Error));
exports.RequestError = RequestError;
/**
 * Sends a GET request.
 *
 * @template RT type of the expected return value
 * @param {string} url
 * @param {Partial<RequestOptions>} [options]
 * @returns {(Promise<[Error, null] | [null, RT]>)}
 */
var get = function (url, options, filter) { return __awaiter(void 0, void 0, void 0, function () {
    var actualOptions, _a, err, resp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                actualOptions = __assign(__assign({}, defaultOptions), options);
                return [4 /*yield*/, new Promise(function (resolve) {
                        needle('get', url, {
                            timeout: actualOptions.timeout
                        }).then(function (_a) {
                            var statusCode = _a.statusCode, resp = __rest(_a, ["statusCode"]);
                            switch (statusCode) {
                                case StatusCode.ok: {
                                    var body = resp.body;
                                    if (filter) {
                                        return resolve([null, filter(body)]);
                                    }
                                    return resolve([null, body]);
                                }
                                case StatusCode.redirected: {
                                    if (actualOptions.maxRedirect) {
                                        var redirectUrl = resp.rawHeaders[resp.rawHeaders.indexOf('Location') + 1];
                                        return resolve(get(redirectUrl, __assign(__assign({}, actualOptions), { maxRedirect: actualOptions.maxRedirect - 1 })));
                                    }
                                    return resolve([
                                        new RequestError('GET request reached maximum redirect times'),
                                        null
                                    ]);
                                }
                                default: {
                                    return resolve([
                                        new RequestError("[" + statusCode + "] " + resp.body + "."),
                                        null
                                    ]);
                                }
                            }
                        }).catch(function (reason) {
                            return [reason, null];
                        });
                    })];
            case 1:
                _a = _b.sent(), err = _a[0], resp = _a[1];
                return [2 /*return*/, [err, resp]];
        }
    });
}); };
var getRedirectedLocation = function (url, options) { return __awaiter(void 0, void 0, void 0, function () {
    var actualOptions, _a, err, resp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                actualOptions = __assign(__assign({}, defaultOptions), options);
                return [4 /*yield*/, new Promise(function (resolve) {
                        needle('get', url, {
                            timeout: actualOptions.timeout
                        }).then(function (_a) {
                            var statusCode = _a.statusCode, resp = __rest(_a, ["statusCode"]);
                            switch (statusCode) {
                                case StatusCode.redirected: {
                                    var redirectUrl = resp.rawHeaders[resp.rawHeaders.indexOf('Location') + 1];
                                    return resolve([null, redirectUrl]);
                                }
                                default: {
                                    return resolve([null, null]);
                                }
                            }
                        }).catch(function (reason) {
                            return [reason, null];
                        });
                    })];
            case 1:
                _a = _b.sent(), err = _a[0], resp = _a[1];
                return [2 /*return*/, [err, resp]];
        }
    });
}); };
/**
 * Downloads a file using GET request.
 *
 * @param {string} url
 * @param {string} output
 * @param {Partial<RequestOptions>} [options]
 * @param {(done: number, total: number) => void} [onProgress]
 * @returns {(Promise<[Error, null] | [null, number]>)}
 */
var download = function (url, output, options, onProgress) { return __awaiter(void 0, void 0, void 0, function () {
    var actualOptions, dir, location, ws, pipedSize, totalSize, _a, err, size;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                actualOptions = __assign(__assign({}, defaultOptions), options);
                dir = path.resolve(output, '..');
                if (fs.existsSync(output)) {
                    fs.rmSync(output);
                }
                else if (!fs.existsSync(dir)) {
                    (0, mkdirp_1.sync)(dir);
                }
                return [4 /*yield*/, getRedirectedLocation(url, options)];
            case 1:
                location = (_b = (_c.sent())[1]) !== null && _b !== void 0 ? _b : url;
                ws = fs.createWriteStream(output);
                pipedSize = 0;
                totalSize = undefined;
                return [4 /*yield*/, new Promise(function (resolve) {
                        needle.get(location, {
                            timeout: actualOptions.timeout
                        }).on('readable', function () {
                            while (true) {
                                var header = this.request.res.rawHeaders;
                                var idx = header.indexOf('Content-Length');
                                if (idx !== -1 && header[idx + 1]) {
                                    totalSize = parseInt(header[idx + 1], 10);
                                }
                                var data = this.read();
                                if (!data) {
                                    break;
                                }
                                ws.write(data);
                                var size_1 = Buffer.from(data).byteLength;
                                pipedSize += size_1;
                                if (onProgress) {
                                    onProgress(pipedSize, totalSize);
                                }
                            }
                        }).on('done', function (err) {
                            ws.end();
                            if (err) {
                                return resolve([err, null]);
                            }
                            else {
                                return resolve([null, pipedSize]);
                            }
                        });
                    })];
            case 2:
                _a = _c.sent(), err = _a[0], size = _a[1];
                return [2 /*return*/, [err, size]];
        }
    });
}); };
var request = {
    get: get,
    download: download,
    npm: npm
};
exports.default = request;
