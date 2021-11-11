/*
 * @Author: Kanata You 
 * @Date: 2021-11-11 18:49:01 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 22:29:56
 */

/* eslint-disable no-magic-numbers, no-useless-escape */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');


const config = fs.existsSync('commitmsgrc.json') ? require(path.resolve('commitmsgrc.json')) : {};

const pattern = {
  type: {
    required: !(config.type?.required === false),
    anyOf:    config.type?.anyOf || [
      'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'
    ],
    minLen:  config.type?.minLen || 1,
    maxLen:  config.type?.maxLen || 12,
    pattern: new RegExp(config.type?.pattern || '.*')
  },
  scope: {
    required: config.scope?.required === true,
    anyOf:    config.scope?.anyOf || [],
    minLen:   config.scope?.minLen || 1,
    maxLen:   config.scope?.maxLen || 16,
    pattern:  new RegExp(config.scope?.pattern || '.*')
  },
  subject: {
    required: config.subject?.required === true,
    anyOf:    config.subject?.anyOf || [],
    minLen:   config.subject?.minLen || 5,
    maxLen:   config.subject?.maxLen || 50,
    pattern:  new RegExp(config.subject?.pattern || '.*')
  },
  body: {
    required: config.body?.required === true,
    anyOf:    config.body?.anyOf || [],
    minLen:   config.body?.minLen || 10,
    maxLen:   config.body?.maxLen || 100,
    pattern:  new RegExp(config.body?.pattern || '.*')
  },
  footer: {
    required: config.footer?.required === true,
    anyOf:    config.footer?.anyOf || [],
    minLen:   config.footer?.minLen || 10,
    maxLen:   config.footer?.maxLen || 100,
    pattern:  new RegExp(config.footer?.pattern || '/^((BREAKING CHANGE)|(Closes #\\d+)): /')
  }
};

/**
 * Parse commit message to object.
 *
 * @param {string} text
 * @returns {null|{ [key in ('type'|'scope'|'subject'|'body'|'footer')]?: string; }}
 */
const parseCommitMessage = text => {
  const match = (
    /* eslint-disable-next-line max-len */
    /^(?<type>[^\n\(\):]*)?(\((?<scope>[^\n]*)\))?: (?<subject>[^\n]*)?(\n\n(?<body>[^\n]*))?(\n\n(?<footer>[^\n]*))?$/
  ).exec(text);

  if (match === null) {
    console.error(
      chalk`{redBright Invalid commit message: "${text}"}`,
      /* eslint-disable-next-line max-len */
      chalk`\n{green Valid format: \n{underline <type>(<scope>): <subject>\\n\\n<body>\\n\\n<footer>}}`
    );
    return null;
  } 
  const data = {
    type:    undefined,
    scope:   undefined,
    subject: undefined,
    body:    undefined,
    footer:  undefined
  };

  let failed = false;

  const keys = ['type', 'scope', 'subject', 'body', 'footer'];
    
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v = match.groups[k];

    if (!v) {
      if (pattern[k].required) {
        console.error(chalk`{red \u2716 } {redBright ${k} is required}`);
        failed = true;
      }
    } else if (pattern[k].anyOf.length) {
      if (pattern[k].anyOf.includes(v)) {
        data[k] = v;
      } else {
        console.error(
          chalk`{red \u2716 } {redBright ${k} must be in ${JSON.stringify(pattern[k].anyOf)}}`
        );
        failed = true;
      }
    } else if (!pattern[k].pattern.test(v)) {
      console.error(
        chalk`{red \u2716 } {redBright ${k} must match {underline ${pattern[k].pattern.toString()}}}`
      );
      failed = true;
    } else if (v.length < pattern[k].minLen || v.length > pattern[k].maxLen) {
      console.error(
        chalk`{red \u2716 } {redBright length of ${k} must be in (${pattern[k].minLen},${pattern[k].maxLen})}`
      );
      failed = true;
    } else {
      data[k] = v;
    }
  }

  if (failed) {
    return null;
  }

  return data;
  
};


module.exports = parseCommitMessage;
