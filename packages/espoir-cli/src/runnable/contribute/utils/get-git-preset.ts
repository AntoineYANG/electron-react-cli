/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 18:43:33 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-12-06 18:32:55
 */

import * as fs from 'fs';
import { execSync } from 'child_process';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';

import env from '@env';
import Logger from '@ui/logger';


export enum GitChangeState {
  A = 'added',
  M = 'modified',
  U = 'untracked',
  D = 'deleted'
}

export type GitFileData = {
  name: string;
  type: GitChangeState;
};

export type GitChangeInfo = {
  staged: GitFileData[];
  notStaged: GitFileData[];
};

export type GitWarning = {
  files: string[];
  reason: string;
  autoFix?: {
    title: string;
    cmd: string;
  }[];
};

export type GitStatus = {
  curBranch: string;
  author: {
    name: string;
    email: string;
  };
  changes: GitChangeInfo;
  warnings: GitWarning[];
};

const gitDir = env.resolvePath('.git');


const printGitWarnings = async (warnings: GitWarning[]): Promise<'continue' | 'abort' | 'retry'> => {
  if (warnings.length === 0) {
    return 'continue';
  }

  const autoFix: Required<GitWarning>['autoFix'] = [];

  warnings.forEach(wrn => {
    Logger.warn(
chalk`{yellow \u26a0  ${wrn.reason}:}
${wrn.files.slice(0, 8).map(f => chalk.blue`    ${f}`).join('\n')}${
  wrn.files.length > 8 ? chalk`\n        ... {yellow ${wrn.files.length} }files in total` : ''
}
`
    );

    if (wrn.autoFix?.length) {
      autoFix.push(...wrn.autoFix);
    }
  });

  const { default: ans } = await inquirer.prompt([{
    type: 'list',
    name: 'default',
    message: autoFix.length ? 'Problems can be auto-fixed' : undefined,
    choices: [
      ...autoFix.map(af => ({
        name: `🛠  ${af.title} `,
        value: af.cmd
      })),
      {
        name: chalk`\u2a2f  {red Abort }`,
        value: false
      },
      {
        name: chalk`\u27a0  {yellow Ignore }`,
        value: true
      }
    ]
  }]);

  if (typeof ans === 'boolean') {
    return ans ? 'continue' : 'abort';
  }

  execSync(
    ans, {
      cwd: env.rootDir
    }
  );

  return 'retry';
};

const getGitPreset = async (): Promise<GitStatus> => {
  if (!fs.existsSync(gitDir)) {
    throw new Error(
      'Cannot find `.git` directory in the workspace root. '
    );
  }

  const branchName = execSync(
    'git branch --show-current', {
      cwd: env.rootDir,
      encoding: 'utf-8'
    }
  ).replace(/\n$/, '');

  const author = {
    name: execSync(
      'git config user.name', {
        encoding: 'utf-8'
      }
    ).replace(/\n$/, ''),
    email: execSync(
      'git config user.email', {
        encoding: 'utf-8'
      }
    ).replace(/\n$/, '')
  };

  const changes = execSync(
    'git status --porcelain=1', {
      cwd: env.rootDir,
      encoding: 'utf-8'
    }
  ).split('\n').reduce<GitChangeInfo>((ctx, str) => {
    if (str === '') {
      return ctx;
    }
    
    const {
      typeRaw,
      name1,
      name2
    } = /^(?<typeRaw>[ AMD?]{2}) ("(?<name1>.+)"|(?<name2>[^\s]+))$/.exec(str)?.groups as {
      typeRaw: string;
      name1?: string;
      name2?: string;
    };

    const name = name1 ?? name2 as string;

    if (name.endsWith('/')) {
      return ctx;
    }

    if (typeRaw === '??') {
      // untracked
      ctx.notStaged.push({
        name,
        type: GitChangeState.U
      });
    } else if (typeRaw.startsWith(' ')) {
      // tracked but not staged
      switch (typeRaw.slice(1, 2)) {
        case 'U': {
          ctx.notStaged.push({
            name,
            type: GitChangeState.U
          });
          break;
        }

        case 'M': {
          ctx.notStaged.push({
            name,
            type: GitChangeState.M
          });
          break;
        }
        
        case 'D': {
          ctx.notStaged.push({
            name,
            type: GitChangeState.D
          });
          break;
        }

        default: {
          throw new Error(
            `Git status info "${str}" is not readable.`
          );
        }
      }
    } else {
      // staged or untracked
      switch (typeRaw.slice(0, 1)) {
        case 'A': {
          ctx.staged.push({
            name,
            type: GitChangeState.A
          });
          break;
        }

        case 'M': {
          ctx.staged.push({
            name,
            type: GitChangeState.M
          });
          break;
        }
        
        case 'D': {
          ctx.staged.push({
            name,
            type: GitChangeState.D
          });
          break;
        }

        default: {
          throw new Error(
            `Git status info "${str}" is not readable.`
          );
        }
      }
    }

    return ctx;
  }, {
    staged:    [],
    notStaged: []
  });

  const warnings: GitWarning[] = [];

  if (changes.notStaged.length > 0) {
    const modifiedAfterStaged = changes.staged.filter(d => {
      const mayModified = changes.notStaged.find(e => e.name === d.name);
      
      return Boolean(mayModified);
    });

    if (modifiedAfterStaged.length > 0) {
      warnings.push({
        files: changes.notStaged.map(d => d.name),
        reason: 'These files are modified after being staged',
        autoFix: [{
          title: 'Include these files',
          cmd: `git add ${changes.notStaged.map(d => (
            d.name.includes(' ') ? `"${d.name}"` : d.name
          )).join(' ')}`
        }, {
          title: 'Include all files',
          cmd: `git add .`
        }]
      });
    } else {
      warnings.push({
        files: changes.notStaged.map(d => d.name),
        reason: 'These changes are not staged for commit',
        autoFix: [{
          title: 'Include all files',
          cmd: 'git add .'
        }]
      });
    }
  }

  const ans = await printGitWarnings(warnings);

  switch (ans) {
    case 'abort': {
      Logger.info('Task aborted. ');
      process.exit(-1);
    }

    case 'continue': {
      break;
    }

    case 'retry': {
      return getGitPreset();
    }

    default: {
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


export default getGitPreset;
