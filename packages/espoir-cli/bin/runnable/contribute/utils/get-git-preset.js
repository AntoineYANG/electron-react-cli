"use strict";
/*
 * @Author: Kanata You
 * @Date: 2021-12-02 18:43:33
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-18 01:16:36
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GitChangeState = void 0;

const fs = require("fs");

const child_process_1 = require("child_process");

const chalk = require("chalk");

const inquirer = require("inquirer");

const _env_1 = require("../../../utils/env");

const logger_1 = require("../../../utils/ui/logger");

var GitChangeState;

(function (GitChangeState) {
  GitChangeState["A"] = "added";
  GitChangeState["M"] = "modified";
  GitChangeState["U"] = "untracked";
  GitChangeState["D"] = "deleted";
  GitChangeState["R"] = "renamed";
})(GitChangeState = exports.GitChangeState || (exports.GitChangeState = {}));

const gitDir = _env_1.default.resolvePath('.git');

const printGitWarnings = async warnings => {
  if (warnings.length === 0) {
    return 'continue';
  }

  const autoFix = [];
  warnings.forEach(wrn => {
    logger_1.default.warn(chalk`{yellow \u26a0  ${wrn.reason}:}
${wrn.files.slice(0, 8).map(f => chalk.blue`    ${f}`).join('\n')}${wrn.files.length > 8 ? chalk`\n        ... {yellow ${wrn.files.length} }files in total` : ''}
`);

    if (wrn.autoFix?.length) {
      autoFix.push(...wrn.autoFix);
    }
  });
  const {
    default: ans
  } = await inquirer.prompt([{
    type: 'list',
    name: 'default',
    message: autoFix.length ? 'Problems can be auto-fixed' : undefined,
    choices: [...autoFix.reduce((list, af) => {
      if (!list.find(e => e.value === af.cmd)) {
        list.push({
          name: `🛠  ${af.title} `,
          value: af.cmd
        });
      }

      return list;
    }, []), ...(autoFix.length ? [{
      name: '\u2b6f  Rerun',
      value: 1
    }] : []), {
      name: chalk`\u2a2f  {red Abort }`,
      value: false
    }, {
      name: chalk`\u27a0  {yellow Ignore }`,
      value: true
    }]
  }]);

  if (ans === 1) {
    return 'retry';
  }

  if (typeof ans === 'boolean') {
    return ans ? 'continue' : 'abort';
  }

  (0, child_process_1.execSync)(ans, {
    cwd: _env_1.default.rootDir
  });
  return 'retry';
};

const getGitPreset = async () => {
  if (!fs.existsSync(gitDir)) {
    throw new Error('Cannot find `.git` directory in the workspace root. ');
  }

  const branchName = (0, child_process_1.execSync)('git branch --show-current', {
    cwd: _env_1.default.rootDir,
    encoding: 'utf-8'
  }).replace(/\n$/, '');
  const author = {
    name: (0, child_process_1.execSync)('git config user.name', {
      encoding: 'utf-8'
    }).replace(/\n$/, ''),
    email: (0, child_process_1.execSync)('git config user.email', {
      encoding: 'utf-8'
    }).replace(/\n$/, '')
  };
  const modifiedAfterStaged = [];
  const changes = (0, child_process_1.execSync)('git status --porcelain=1', {
    cwd: _env_1.default.rootDir,
    encoding: 'utf-8'
  }).split('\n').reduce((ctx, str) => {
    if (str === '') {
      return ctx;
    }

    const {
      typeRaw,
      name1,
      name2,
      curName
    } = /^(?<typeRaw>[ AMDR?]{2}) ("(?<name1>.+)"|(?<name2>[^\s]+)|(?<preName>.+) -> (?<curName>.+))$/.exec(str)?.groups;
    const name = typeRaw.includes('R') ? curName : name1 ?? name2;

    if (name.endsWith('/')) {
      return ctx;
    }

    if (typeRaw === '??') {
      // untracked
      ctx.notStaged.push({
        name,
        type: GitChangeState.U
      });
    } else if (/^[AMDR]{2}$/.test(typeRaw.slice(0, 2))) {
      // added but remodified
      const type1 = {
        U: GitChangeState.U,
        A: GitChangeState.A,
        M: GitChangeState.M,
        D: GitChangeState.D,
        R: GitChangeState.R
      }[typeRaw.slice(0, 1)];
      const type2 = {
        U: GitChangeState.U,
        A: GitChangeState.A,
        M: GitChangeState.M,
        D: GitChangeState.D,
        R: GitChangeState.R
      }[typeRaw.slice(1, 2)];
      ctx.staged.push({
        name,
        type: type1
      });
      ctx.notStaged.push({
        name,
        type: type2
      });
      modifiedAfterStaged.push({
        name,
        type: type2
      });
    } else if (typeRaw.startsWith(' ')) {
      // tracked but not staged
      switch (typeRaw.slice(1, 2)) {
        case 'U':
          {
            ctx.notStaged.push({
              name,
              type: GitChangeState.U
            });
            break;
          }

        case 'M':
          {
            ctx.notStaged.push({
              name,
              type: GitChangeState.M
            });
            break;
          }

        case 'D':
          {
            ctx.notStaged.push({
              name,
              type: GitChangeState.D
            });
            break;
          }

        case 'R':
          {
            ctx.notStaged.push({
              name,
              type: GitChangeState.R
            });
            break;
          }

        default:
          {
            throw new Error(`Git status info "${str}" is not readable.`);
          }
      }
    } else {
      // staged or untracked
      switch (typeRaw.slice(0, 1)) {
        case 'A':
          {
            ctx.staged.push({
              name,
              type: GitChangeState.A
            });
            break;
          }

        case 'M':
          {
            ctx.staged.push({
              name,
              type: GitChangeState.M
            });
            break;
          }

        case 'D':
          {
            ctx.staged.push({
              name,
              type: GitChangeState.D
            });
            break;
          }

        case 'R':
          {
            ctx.staged.push({
              name,
              type: GitChangeState.R
            });
            break;
          }

        default:
          {
            throw new Error(`Git status info "${str}" is not readable.`);
          }
      }
    }

    return ctx;
  }, {
    staged: [],
    notStaged: []
  });
  const warnings = [];

  if (changes.notStaged.length > 0) {
    const commonResolvable = [{
      title: 'Include all unstaged files',
      cmd: 'git add .'
    }];

    if (modifiedAfterStaged.length > 0) {
      warnings.push({
        files: changes.notStaged.map(d => d.name),
        reason: 'These files are modified after being staged',
        autoFix: [{
          title: 'Include remodified files',
          cmd: `git add ${changes.notStaged.map(d => d.name.includes(' ') ? `"${d.name}"` : d.name).join(' ')}`
        }, ...commonResolvable]
      });
    }

    if (modifiedAfterStaged.length < changes.notStaged.length) {
      warnings.push({
        files: changes.notStaged.map(d => d.name),
        reason: 'These changes are not staged for commit',
        autoFix: commonResolvable
      });
    }
  }

  const ans = await printGitWarnings(warnings);

  switch (ans) {
    case 'abort':
      {
        logger_1.default.info('Task aborted. ');
        process.exit(-1);
      }

    case 'continue':
      {
        break;
      }

    case 'retry':
      {
        return getGitPreset();
      }

    default:
      {
        break;
      }
  }

  return {
    author,
    curBranch: branchName,
    changes,
    warnings
  };
};

exports.default = getGitPreset;