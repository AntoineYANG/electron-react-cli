"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-11 15:21:52
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 18:56:58
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printChangelog = exports.parseChangelog = exports.ChangLogItemType = void 0;

const fs = require("fs");

const path = require("path");

const child_process_1 = require("child_process");

const semver = require("semver");

const chalk = require("chalk");

const _env_1 = require("../../../utils/env");

var ChangLogItemType;

(function (ChangLogItemType) {
  ChangLogItemType[ChangLogItemType["version"] = 0] = "version";
  ChangLogItemType[ChangLogItemType["migration"] = 1] = "migration";
})(ChangLogItemType = exports.ChangLogItemType || (exports.ChangLogItemType = {}));
/**
 * Gets the current version of the package.
 * If the version of a package (not root package) is not defined,
 * automatically initializes it with '1.0.0'.
 *
 * @param {string} _package
 * @returns {string}
 */


const requirePackageVersion = _package => {
  if (!_env_1.default.rootDir || !_env_1.default.packageMap || !_env_1.default.rootPkg) {
    throw new Error(`You're outside a espoir workspace.`);
  }

  const version = _env_1.default.packageMap[_package]?.version;

  if (!version) {
    _env_1.default.packageMap[_package].version = '1.0.0';
    fs.writeFileSync(_env_1.default.resolvePathInPackage(_package, 'package.json'), JSON.stringify(_env_1.default.packageMap[_package], undefined, 2) + '\n', {
      encoding: 'utf-8'
    });
    return '1.0.0';
  }

  return version;
};

const parseChangelog = raw => {
  return raw.split('\n').reduce((context, line) => {
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
      const info = /^\+ (?<mark>.+) \*\*(?<msg>.+)\*\* \- (?<author>.*)\((?<email>.+@.+\.com)\) (?<date>[0-9/]+), on _(?<branch>.+)_$/.exec(line)?.groups;

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
      const {
        v: version
      } = /^## (?<v>[0-9.]+) /.exec(line)?.groups;
      context.curVersion = {
        type: ChangLogItemType.version,
        version,
        body: '',
        details: {}
      };
      context.data.push(context.curVersion);
      context.isVersionBody = true;
    } else if (line.startsWith('### ')) {
      const {
        scope
      } = /^### (?<scope>.*)$/.exec(line)?.groups;
      context.curScope = scope;

      if (context.curVersion) {
        context.curVersion.details[scope] = [];
      }
    }

    return context;
  }, {
    data: []
  }).data;
};

exports.parseChangelog = parseChangelog;

const parseChangelogFile = p => {
  if (fs.existsSync(p)) {
    const raw = fs.readFileSync(p, {
      encoding: 'utf-8'
    }).split('\n').slice(2);
    return (0, exports.parseChangelog)(raw.join('\n'));
  }

  return [];
};

const printChangelog = (data, filter = null) => {
  const versions = data.filter(d => d.type === ChangLogItemType.version);
  const raw = versions.sort((a, b) => semver.lt(a.version, b.version) ? 1 : -1).map(d => {
    const body = d.body.includes('_\\<version description\\>_') ? '' : `  ${d.body.split('\n').map(line => {
      const tmp = line.replace( // unordered list item
      /^[\+\-\*] /, ' \u25fd  ').replace( // inline codes
      /`[^`]+`/g, code => chalk.bgGray.black.italic(`${code.slice(1, -1)}`)).replace( // links
      /\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => `${chalk.gray('[')}${chalk.blueBright.underline(text)}${chalk.gray(']( ')}${chalk.blue.underline( // remote url
      url.replace(/^\./, _env_1.default.runtime.espoir.github.replace('/README.md', '')))}${chalk.gray(' )')}`);
      return chalk(tmp);
    }).join('\n')}\n`;
    return ` ${chalk.blueBright.bold(`v${d.version}`)}
${body}${Object.entries(d.details).reduce((lines, [scope, data]) => {
      const items = data.sort((a, b) => b.time - a.time).filter(d => filter === null || filter.includes(d.type));

      if (items.length === 0) {
        return lines;
      }

      const line = `  ${`> ${chalk.italic.cyan(scope)}`}
${items.map(d => {
        return `     ${(filter?.length ?? 0) === 1 ? '' : chalk.greenBright(`[${d.type}] `)}${(filter?.length ?? 0) === 1 ? chalk.greenBright(`⚙ ${d.message}`) : d.message}`;
      }).join('\n')}
`;
      return [...lines, line];
    }, []).join('\n') || '(none)'}`;
  }).join('\n');
  return raw;
};

exports.printChangelog = printChangelog;

const dumpChangelog = (name, data) => {
  const versions = data.filter(d => d.type === ChangLogItemType.version);
  const raw = versions.sort((a, b) => semver.lt(a.version, b.version) ? 1 : -1).map(d => {
    const time = Object.values(d.details).map(e => e.map(i => i.time)).flat().sort((a, b) => a - b).map(t => new Date(t).toLocaleDateString());
    const contributors = Object.values(d.details).reduce((list, e) => {
      e.forEach(({
        author
      }) => {
        if (!list.find(k => k.name === author.name)) {
          list.push(author);
        }
      });
      return list;
    }, []);
    return `## ${d.version} (${time.length > 1 && time[0] !== time[time.length - 1] ? `${time[0]} - ${time[time.length - 1]}` : `${time[0]}`})

${d.body}

**Contributors**

${contributors.map(c => `- **${c.name}** (${c.email})`).join('\n')}

${Object.entries(d.details).map(([scope, data]) => {
      return `### ${scope}

${data.sort((a, b) => b.time - a.time).map(d => {
        return `+ ${{
          feature: '🌱',
          bugfix: '🐞',
          refactor: '🧬',
          performance: '⏱',
          chore: '🧰'
        }[d.type] ?? '🔨'} **${d.message}** - ${d.author.name}(${d.author.email}) ${new Date(d.time).toLocaleDateString()}, on _${d.curBranch}_
`;
      }).join('\n')}
`;
    }).join('\n')}`;
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


const writeChangelog = (state, scopes, msg, type) => {
  const packages = state.changes.staged.reduce((list, {
    name
  }) => {
    if (!_env_1.default.packages) {
      throw new Error(`You're outside a espoir workspace.`);
    }

    if (name.match(/^packages\//)) {
      const scope = /^packages\/(?<w>[^/]+)/.exec(name)?.groups.w;

      if (_env_1.default.packages.includes(scope)) {
        if (!list.find(e => e.package === scope)) {
          const version = requirePackageVersion(scope);
          list.push({
            package: scope,
            version
          });
        }
      }
    }

    return list;
  }, []);
  const data = packages.map(scope => {
    const dir = scope.package === 'root' ? _env_1.default.resolvePath() : _env_1.default.resolvePathInPackage(scope.package);
    const version = semver.valid(semver.coerce(scope.version)) ?? '1.0.0';
    const major = semver.major(version);
    const output = path.join(dir, `CHANGELOG-${major}.x.md`);
    const data = parseChangelogFile(output);
    let curVersion = data.find(v => v.type === ChangLogItemType.version && v.version === version);

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
      let curScope = curVersion.details[scope];

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
    const name = `${d.workspace} v${d.version.split('.')[0]}.x`;
    const raw = dumpChangelog(name, d.data);
    fs.writeFileSync(d.path, raw);
    (0, child_process_1.execSync)(`git add ${d.path}`);
  });
  return data;
};

exports.default = writeChangelog;