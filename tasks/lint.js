/*
 * @Author: Kanata You
 * @Date: 2021-11-11 03:22:03
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 18:19:00
 */

// # ************************************
// # This uses ESLint to check and auto-fix the included packages.
// # ************************************

const eslint = require('eslint');

const { StopWatch } = require('./utils/performance.js');
const { printResults } = require('./utils/eslint-formatters.js');


/**
 * Triggers [lint] scripts for packages.
 * @param {'workspace'|'staged'} [mode='workspace']
 * @param {boolean} [fix=true]
 * @returns {Promise<boolean>}
 */
const lint = async (mode = 'workspace', fix = true) => {
  const timer = new StopWatch('Task [lint]');

  const engine = new eslint.ESLint({
    allowInlineConfig:       true,
    cache:                   false,
    cacheLocation:           '.eslintcache',
    cacheStrategy:           'metadata',
    errorOnUnmatchedPattern: true,
    fix,
    ignore:                  true,
    useEslintrc:             true,
  });

  /** @type {string[]} */
  const files = [];

  if (mode === 'staged') {
    const getStagedFiles = require('lint-staged/lib/getStagedFiles.js');
    const resolveGitRepo = require('lint-staged/lib/resolveGitRepo.js');
    const { gitDir } = await resolveGitRepo(process.cwd());
    files.push(...(
      await getStagedFiles({ cwd: gitDir })
    ).filter(fn => (
      /((^hooks\/)|(^tasks\/)|(^packages\/[^/]+\/src\/)).*\.(js|ts)x?$/.test(fn)
    )));
  } else {
    files.push('hooks/', 'tasks/', 'packages/*/src/**');
  }
  
  /** @type {import('eslint').ESLint.LintResult[]} */
  const results = await engine.lintFiles(files);

  if (fix) {
    await eslint.ESLint.outputFixes(results);
  }

  const ok = printResults(results);

  timer.log();

  return ok;
};

if (module === require.main) {
  lint().then(ok => {
    process.exit(ok ? 0 : -1);
  });
}


module.exports = lint;
