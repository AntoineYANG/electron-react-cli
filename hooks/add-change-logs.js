/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 01:43:11 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-12 01:59:28
 */

const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');

const { readCache } = require('./utils/cache.js');


const hook = async () => {
  const files = readCache('change_logs_to_add').split('\n');

  const added = await new Promise((resolve, reject) => {
    const handle = spawn(
      'git',
      ['add', ...files.map(f => `${f}`)],
      {
        cwd: path.resolve(__dirname, '..')
      }
    );
    
    handle.stdout.on('data', data => {
      process.stdout.write(String(data));
    });
    handle.stderr.on('data', data => {
      process.stdout.write(String(data));
    });
    handle.on('error', err => {
      handle.kill(-1);
      reject(err);
    });
    handle.on('close', code => {
      resolve(code);
    });
  }).catch(err => {
    console.error(err);
    return -1;
  });

  const ok = await new Promise(resolve => setTimeout(() => resolve(added === 0), 1000 * 2));
  
  return ok ? 0 : -1;
};

hook().then(code => {
  if (code === 0) {
    console.log(chalk`{greenBright.bold commit message check succeeded}`);
  } else {
    console.error(chalk`{redBright.bold commit message check failed}`);
  }

  return code;
}).then(process.exit);
