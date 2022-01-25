"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 20:16:27
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 20:50:07
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@src/index");
const logger_1 = require("@ui/logger");
const create_package_1 = require("./tasks/create-package");
const package_setup_1 = require("./tasks/package-setup");
/**
 * Create new package in this monorepo.
 *
 * @returns {Promise<ExitCode>}
 */
const newPackage = async () => {
    logger_1.default.info('  Creating new package. ');
    const config = await (0, package_setup_1.default)();
    await (0, create_package_1.default)(config);
    logger_1.default.info(`  Completed. `);
    return index_1.ExitCode.OK;
};
exports.default = newPackage;
