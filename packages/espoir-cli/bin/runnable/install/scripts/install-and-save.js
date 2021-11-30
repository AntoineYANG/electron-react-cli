"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-11-20 22:17:42
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-30 20:44:41
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_1 = require("../../../..");

const _runnable_1 = require("../..");

const view_deps_from_args_1 = require("./tasks/view-deps-from-args");

const diff_local_files_1 = require("./tasks/diff-local-files");

const install_resolved_deps_1 = require("./tasks/install-resolved-deps");

const create_links_1 = require("./tasks/create-links");

const save_lock_file_1 = require("./tasks/save-lock-file");

const save_fail_msg_1 = require("./tasks/save-fail-msg");

const save_package_json_1 = require("./tasks/save-package-json");

const link_executable_1 = require("./tasks/link-executable");

;
/**
 * Install modules and save as package dependencies.
 *
 * @param {string[]} modules
 * @param {string[]} scopes
 * @param {('dependencies' | 'devDependencies')} tag
 * @returns {Promise<ExitCode>}
 */

const installAndSave = async (modules, scopes, tag) => {
  const tasks = (0, _runnable_1.TaskManagerFactory)();
  tasks.add([(0, view_deps_from_args_1.default)(modules), (0, diff_local_files_1.default)(), (0, install_resolved_deps_1.default)(), (0, create_links_1.default)(), (0, link_executable_1.default)(), (0, save_lock_file_1.default)(), (0, save_fail_msg_1.default)(), (0, save_package_json_1.default)(scopes, tag)], {
    rendererOptions: {
      showSkipMessage: false
    },
    exitOnError: true,
    concurrent: false
  });

  const _ctx = await tasks.runAll();

  return index_1.ExitCode.OK;
};

exports.default = installAndSave;