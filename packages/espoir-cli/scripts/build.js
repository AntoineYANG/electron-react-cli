/*
 * @Author: Kanata You 
 * @Date: 2021-11-23 21:50:19 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 21:38:10
 */

const { exec } = require('child_process');


const tscBuild = () => new Promise(resolve => {
  exec('npx tsc', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    if (stderr) {
      console.error(stderr);
      process.exit(2);
    }

    console.log(stdout);
    resolve();
  });
});

const main = async () => {
  try {
    await tscBuild();
  } catch (error) {
    console.error(error);

    return 1;
  }

  return 0;
};


main().then(process.exit);
