/*
 * @Author: Kanata You 
 * @Date: 2021-11-11 19:48:44 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-12 01:37:10
 */

/* eslint-disable guard-for-in */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');


const author = execSync('git config user.name', { encoding: 'utf-8' }).replace(/\n$/, '');


/**
 * Log commit message to CHANGELOG.md.
 *
 * @param {{ [key in ('type'|'scope'|'subject'|'body'|'footer')]?: string; }} msg
 */
const logChange = async msg => {
  const getStagedFiles = require('lint-staged/lib/getStagedFiles.js');
  const resolveGitRepo = require('lint-staged/lib/resolveGitRepo.js');
  const { gitDir } = await resolveGitRepo(process.cwd());
  const whatIsChanged = {
    base:     false,
    packages: []
  };
  (await getStagedFiles({ cwd: gitDir })).forEach(fn => {
    if (/^packages\/[^/]+\//.test(fn)) {
      const { p } = /^packages\/(?<p>[^/]+)\//.exec(fn).groups;

      if (!whatIsChanged.packages.includes(p)) {
        whatIsChanged.packages.push(p);
      }
    } else {
      whatIsChanged.base = true;
    }
  });

  /** @type {string[]} */
  const modifiedMd = [];
  /** @type {Promise<string>[]} */
  const ps = [];
  
  if (whatIsChanged.base) {
    ps.push(
      logUnitChange('.', msg)
    );
  }
  whatIsChanged.packages.forEach(p => {
    ps.push(
      logUnitChange(path.resolve('packages', p), msg)
    );
  });

  await Promise.all(ps).then(data => {
    modifiedMd.push(...data);
  });

  return modifiedMd;
};


/**
 * @param {dir} string
 * @param {{ [key in ('type'|'scope'|'subject'|'body'|'footer')]?: string; }} msg
 */
const logUnitChange = async (dir, msg) => {
  const { version = '0.0.0' } = require(path.resolve(dir, 'package.json'));
  const { X } = (
    /^(?<X>\d+)\.\d+\.\d+(-(alpha|beta)-\d+\.\d+\.\d+)?$/
  ).exec(version).groups;
  const { v } = (
    /^(?<v>\d+\.\d+\.\d+)/
  ).exec(version).groups;
  const md = path.resolve(dir, `CHANGELOG-${X}.x.md`);
  const head = msg.type || 'update';
  const scope = msg.scope || 'project';
  let logs = {};

  if (fs.existsSync(md)) {
    const before = fs.readFileSync(md, { encoding: 'utf-8' });
    logs = parseChangeLog(before);
  }
  logs[v] = {
    ...(logs[v] || {}),
    [head]: {
      ...(logs[v]?.[head] || {}),
      [scope]: [
        ...(logs[v]?.[head]?.[scope] || []),
        {
          subject: msg.subject || 'Unsubjected commit',
          author,
          time:    new Date().getTime()
        }
      ]
    }
  };
  await writeChangeLog(md, logs);

  return md;
};

const parseChangeLog = text => {
  const data = {};

  let temp = text.replace(/(\r\n)/g, '\n');

  while (temp.length) {
    const versionTitle = /^## (?<version>[^\s]+).*\n{2}/.exec(temp);

    if (versionTitle) {
      const v = versionTitle.groups.version;
      const idx = temp.indexOf(versionTitle[0]);
      temp = temp.substring(idx + versionTitle[0].length);
      data[v] = {};

      while (temp.length) {
        const typeTitle = /^#### .*(?<type>\b.+\b)\n{2}/.exec(temp);

        if (typeTitle) {
          const t = typeTitle.groups.type;
          const idx = temp.indexOf(typeTitle[0]);
          temp = temp.substring(idx + typeTitle[0].length);
          data[v][t] = {};

          /* eslint-disable max-depth */
          while (temp.length) {
            const scopeTitle = /^- `(?<scope>\b.+\b)` *\n{2}/.exec(temp);

            if (scopeTitle) {
              const s = scopeTitle.groups.scope;
              const idx = temp.indexOf(scopeTitle[0]);
              temp = temp.substring(idx + scopeTitle[0].length);
              data[v][t][s] = [];

              while (temp.length) {
                const itemTitle = (
                  /* eslint-disable-next-line max-len */
                  /^ {2}- (?<subject>.*\b). (\(\[@(?<author>[^\]]+)\]\(.*\)\))?(&nbsp;){3}<small data-date="(?<time>\d+)">.*\n{2}/
                ).exec(temp);

                if (itemTitle) {
                  const { author, subject, time } = itemTitle.groups;
                  const idx = temp.indexOf(itemTitle[0]);
                  temp = temp.substring(idx + itemTitle[0].length);
                  
                  data[v][t][s].push({
                    author,
                    subject,
                    time: parseInt(time, 10)
                  });
                } else {
                  break;
                }
              }
            } else {
              break;
            }
          }
          /* eslint-enable max-depth */
        } else {
          break;
        }
      }

    } else {
      break;
    }
  }

  return data;
};

/* eslint-disable max-len */
/**
 * @param {string} fn
 * @param {{[version: string]: {[type: string]: {[scope: string]: { subject: string; author?: string; time: number; }[]}}}} logs
 */
const writeChangeLog = async (fn, logs) => {
  /* eslint-enable max-len */
  let data = '';

  for (const version in logs) {
    const releaseTime = Math.min(
      ...Object.values(logs[version]).map(type => Math.min(
        Object.values(type).map(scope => Math.min(
          Date.now().valueOf(),
          ...scope.map(s => s.time)
        ))
      )),
      Date.now().valueOf()
    );
    data += (
      `## ${version}  ${new Date(releaseTime).toLocaleDateString()}

`
    );

    for (const type in logs[version]) {
      data += (
        `#### ${{
          feat:     '💡 ',
          fix:      '🐛 ',
          docs:     '📙 ',
          style:    '🧹 ',
          refactor: '🔗 ',
          test:     '📊 ',
          chore:    '🧰 '
        }[type] || '⛳ '} ${type}

`
      );

      for (const scope in logs[version][type]) {
        data += (
          `- \`${scope}\`

`
        );

        logs[version][type][scope].sort((a, b) => b.time - a.time).forEach(({ author, subject, time }) => {
          data += (
            `  - ${subject}. ${author ? `([@${author}](https://github.com/${author}))` : ''}${
              '&nbsp;'.repeat(3)
            }<small data-date="${
              Number(time)
            }">${
              new Date(time).toLocaleString()
            }</small>

`
          );
        });
      }
    }
  }

  const _ = await new Promise(resolve => {
    fs.writeFile(
      fn,
      data,
      { encoding: 'utf-8' },
      () => {
        resolve();
      }
    );
  });
  console.log(`[${_}] write ${fn}`);
};


module.exports = logChange;
