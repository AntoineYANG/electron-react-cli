/*
 * @Author: Kanata You 
 * @Date: 2021-11-12 17:12:34 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-13 02:06:46
 */

const {
  getAvailableVersions,
  downloadPackage
} = require('./pm/download.js');
const { progress } = require('./pm/install-progress.js');


/**
 * Installs a module.
 *
 * @param {string} name name of the module
 * @param {string} version semver
 * @param {import('../scripts/node-package').InstallOptions} options install options
 * @returns {import('../scripts/node-package').DownloadInfo}
 */
const installModule = (name, version, options) => new Promise((resolve, reject) => {
  getAvailableVersions(name, version, options).then(async availableList => {
    if (availableList.length === 0) {
      const msg = `Cannot find a version of ${name} meeting "${version}"`;
      reject(new Error(msg));
      return;
    }
  
    progress(name, 'view', -1);
  
    const [actualVersion] = availableList;
    
    /* eslint-disable callback-return */
    try {
      const result = await downloadPackage(actualVersion, options.where);
    
      progress(name, 'done', -1);
      
      resolve(result);
    } catch (error) {
      progress(name, 'failed', -1);

      reject(error);
    }
    /* eslint-enable callback-return */
  }).catch(reject);
});


module.exports = installModule;
