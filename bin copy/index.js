/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 15:19:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-13 02:03:06
 */

const fs = require('fs');

const env = require('./utils/env.js');
const install = require('./scripts/install.js');


const CODE_UNKNOWN_COMMAND = -2;

const main = async () => {
  let code = CODE_UNKNOWN_COMMAND;

  switch (process.argv[2] || '') {
    case 'install': {
      code = await install();

      break;
    }

    default: {
      console.error(`Unknown command: ${process.argv[2]}`);
      
      break;
    }
  }

  return code;
};


main().then(returnCode => {
  // clear output
  if (fs.existsSync(env.resolvePath('.espoir'))) {
    // fs.rmdirSync(
    //   env.resolvePath('.espoir'),
    //   {
    //     recursive: true
    //   }
    // );
  }

  return returnCode;
}).then(process.exit);
