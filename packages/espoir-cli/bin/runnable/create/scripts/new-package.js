"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 20:16:27
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:58:01
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_1 = require("../../../..");

const logger_1 = require("../../../utils/ui/logger");

const create_package_1 = require("./tasks/create-package");

const package_setup_1 = require("./tasks/package-setup");

const install_for_package_1 = require("./tasks/install-for-package");
/**
 * Create new package in this monorepo.
 *
 * @returns {Promise<ExitCode>}
 */


const newPackage = async () => {
  logger_1.default.info('  Creating new package. ');
  const config = await (0, package_setup_1.default)();
  const {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {}
  } = await (0, create_package_1.default)(config);
  const deps = Object.keys({ ...dependencies,
    ...devDependencies,
    ...peerDependencies
  }).length;

  if (deps) {
    await (0, install_for_package_1.default)(config.name);
  }

  logger_1.default.info(`  Completed. `);
  return index_1.ExitCode.OK;
};

exports.default = newPackage;