/*
 * @Author: Kanata You 
 * @Date: 2022-01-11 15:21:52 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 18:15:10
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as semver from 'semver';

import env, { PackageJSON } from '@env';
import type { GitStatus } from './get-git-preset';



export enum ChangLogItemType {
  version = 0,
  migration = 1,
}

export type ChangeLogMigration = {
  type: ChangLogItemType.migration;
  fromMajor: number;
  toMajor: number;
  body: string;
};

export type ChangeLogDetail = {
  curBranch: string;
  author: {
    name: string;
    email: string;
  };
  message: string;
  type: string;
  time: number;
};

export type ChangeLogVersionComment = {
  type: ChangLogItemType.version;
  version: string;
  body: string;
  details: {
    [scope: string]: ChangeLogDetail[];
  };
};

export type ChangeLogData = {
  workspace: string;
  version: string;
  path: string;
  data: Array<
    | ChangeLogMigration
    | ChangeLogVersionComment
  >;
};

/**
 * Gets the current version of the package.
 * If the version of a package (not root package) is not defined,
 * automatically initializes it with '1.0.0'.
 *
 * @param {string} _package
 * @returns {string}
 */
const requirePackageVersion = (_package: string): string => {
  if (!env.rootDir || !env.packageMap || !env.rootPkg) {
    throw new Error(
      `You're outside a espoir workspace.`
    );
  }

  if (_package === 'root') {
    const version = env.rootPkg.version;

    if (!version) {
      return '1.0.0';
    }

    return version;
  }

  const version = env.packageMap[_package]?.version;

  if (!version) {
    (env.packageMap[_package] as PackageJSON).version = '1.0.0';

    fs.writeFileSync(
      env.resolvePathInPackage(_package, 'package.json'),
      JSON.stringify(env.packageMap[_package], undefined, 2) + '\n', {
        encoding: 'utf-8'
      }
    );

    return '1.0.0';
  }

  return version;
};

const parseChangelog = (p: string): ChangeLogData['data'] => {
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, {
      encoding: 'utf-8'
    }).split('\n').slice(2);

    return raw.reduce<{
      curVersion?: ChangeLogVersionComment;
      curScope?: string;
      isVersionBody?: boolean;
      data: ChangeLogData['data'];
    }>((context, line) => {
      if (line === '**Contributors**') {
        if (context.curVersion) {
          context.curVersion.body = context.curVersion.body.replace(/^\n+/, '').replace(/\n+$/, '');
        }

        context.isVersionBody = false;

        return context;
      } else if (context.isVersionBody && context.curVersion) {
        context.curVersion.body += line + '\n';

        return context;
      } else if (line.trim() === '' || line.startsWith('- ')) {
        return context;
      } else if (line.startsWith('+ ')) {
        const info = (
          /^\+ (?<mark>.+) \*\*(?<msg>.+)\*\* \- (?<author>.*)\((?<email>.+@.+\.com)\) (?<date>[0-9/]+), on _(?<branch>.+)_$/
        ).exec(line)?.groups as {
          mark: string;
          msg: string;
          author: string;
          email: string;
          date: string;
          branch: string;
        };

        if (context.curVersion && context.curScope) {
          context.curVersion.details[context.curScope]?.push({
            curBranch: info.branch,
            author: {
              name: info.author,
              email: info.email
            },
            message: info.msg,
            type: {
              '🌱': 'feature',
              '🐞': 'bugfix',
              '🧬': 'refactor',
              '⏱': 'performance',
              '🧰': 'chore'
            }[info.mark] ?? 'other',
            time: new Date(info.date).getTime()
          });
        }
      } else if (line.startsWith('## ')) {
        const { v: version } = (/^## (?<v>[0-9.]+) /.exec(line)?.groups as {
          v: string;
        });

        context.curVersion = {
          type: ChangLogItemType.version,
          version,
          body: '',
          details: {}
        };
        
        context.data.push(context.curVersion);

        context.isVersionBody = true;
      } else if (line.startsWith('### ')) {
        const { scope } = /^### (?<scope>.*)$/.exec(line)?.groups as {
          scope: string;
        };
        context.curScope = scope;
        
        if (context.curVersion) {
          context.curVersion.details[scope] = [];
        }
      }

      return context;
    }, {
      data: []
    }).data;
  }

  return [];
};

const dumpChangelog = (name: string, data: ChangeLogData['data']): string => {
  const versions = data.filter(d => d.type === ChangLogItemType.version) as ChangeLogVersionComment[];

  const raw = versions.sort(
    (a, b) => semver.lt(a.version, b.version) ? 1 : -1
  ).map(d => {
    const time = Object.values(d.details).map(
      e => e.map(i => i.time)
    ).flat().sort((a, b) => a - b).map(
      t => new Date(t).toLocaleDateString()
    );

    const contributors = Object.values(d.details).reduce<{
      name: string;
      email: string;
    }[]>(
      (list, e) => {
        e.forEach(({ author }) => {
          if (!list.find(k => k.name === author.name)) {
            list.push(author);
          }
        })
        return list;
      }, []
    );

    return (
`## ${d.version} (${
  time.length > 1 && time[0] !== time[time.length - 1] ? `${time[0]} - ${time[time.length - 1]}` : `${time[0]}`
})

${d.body}

**Contributors**

${contributors.map(c => (
  `- **${c.name}** (${c.email})`
)).join('\n')}

${Object.entries(d.details).map(([scope, data]) => {
  return (
`### ${scope}

${data.sort(
  (a, b) => b.time - a.time
).map(d => {
  return (
`+ ${{
  feature: '🌱',
  bugfix: '🐞',
  refactor: '🧬',
  performance: '⏱',
  chore: '🧰',
}[d.type] ?? '🔨'} **${d.message}** - ${d.author.name}(${d.author.email}) ${
  new Date(d.time).toLocaleDateString()
}, on _${d.curBranch}_
`
  );
}).join('\n')}
`
  );
}).join('\n')}`
    );
  }).join('\n');

  return `# ${name}

${raw}
`;
};


/**
 * Generates change log.
 *
 * @param {GitStatus} state git info
 * @param {string[]} scopes modified scopes
 * @param {string} msg commit message
 * @param {string} type commit type
 * @returns {ChangeLogData[]} modified change log data
 */
const writeChangelog = (state: GitStatus, scopes: string[], msg: string, type: string): ChangeLogData[] => {
  const packages = state.changes.staged.reduce<{
    package: string;
    version: string;
  }[]>((list, { name }) => {
    if (!env.packages) {
      throw new Error(
        `You're outside a espoir workspace.`
      );
    }
    
    if (name.match(/^packages\//)) {
      const scope = (/^packages\/(?<w>[^/]+)/.exec(name)?.groups as {
        w: string;
      }).w;

      if (env.packages.includes(scope)) {
        if (!list.find(e => e.package === scope)) {
          const version = requirePackageVersion(scope);

          list.push({
            package: scope,
            version
          });
        }
      }

    } else {
      if (!list.find(e => e.package === 'root')) {
        const version = requirePackageVersion('root');

        list.push({
          package: 'root',
          version
        });
      }
    }

    return list;
  }, []);

  const data = packages.map<ChangeLogData>(scope => {
    const dir = scope.package === 'root' ? env.resolvePath() : env.resolvePathInPackage(scope.package);
    const version = semver.valid(semver.coerce(scope.version)) ?? '1.0.0';
    const major = semver.major(version);
    const output = path.join(dir, `CHANGELOG-${major}.x.md`);
    const data: ChangeLogData['data'] = parseChangelog(output);
    
    let curVersion = data.find(
      v => v.type === ChangLogItemType.version && (v as ChangeLogVersionComment).version === version
    ) as ChangeLogVersionComment ;

    if (!curVersion) {
      curVersion = {
        type: ChangLogItemType.version,
        version,
        body: '_\\<version description\\>_',
        details: {}
      };
      data.push(curVersion);
    }

    scopes.forEach(scope => {
      let curScope = curVersion.details[scope] as ChangeLogDetail[];

      if (!curScope) {
        curScope = [];
        curVersion.details[scope] = curScope;
      }

      curScope.push({
        curBranch: state.curBranch,
        author: state.author,
        message: msg,
        time: Date.now(),
        type
      });
    });

    return {
      workspace: scope.package,
      version: scope.version,
      path: output,
      data
    };
  });

  data.forEach(d => {
    const name = `${d.workspace} v${d.version.split('.')[0]}.x`
    const raw = dumpChangelog(name, d.data);

    fs.writeFileSync(d.path, raw);

    execSync(`git add ${d.path}`);
  });

  return data;
};


export default writeChangelog;
