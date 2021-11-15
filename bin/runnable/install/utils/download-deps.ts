/*
 * @Author: Kanata You 
 * @Date: 2021-11-16 00:03:04 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-16 01:17:23
 */

import * as path from 'path';
import * as semver from 'semver';

import env from '../../../utils/env';
import request from '../../../utils/request';
import { VersionInfo } from '../../../utils/request/request-npm';
import progress, { ProgressTag } from './progress';


const batchDownload = async (modules: VersionInfo[]) => {
  // download the .tgz file
  const tasks = modules.map(async mod => {
    const { name } = mod;
    const dir = path.join(
      env.resolvePath('.espoir', '.download'),
      name,
      (semver.valid(semver.coerce(mod.version)) as string).replace(/\./g, '_')
    );
    const url = mod.dist.tarball;
    const fn = url.split(/\/+/).reverse()[0] as string;
    const p = path.join(dir, fn);
    
    progress(name, ProgressTag.prepare, -1);
    
    const [downloadErr, size] = await request.download(
      url,
      p,
      {},
      (done, total) => {
        progress(name, ProgressTag.download, total ? done / total : 0);
      }
    );

    if (downloadErr) {
      progress(name, ProgressTag.failed, -1);
    } else {
      progress(name, ProgressTag.done, -1); // FIXME: not here
    }

    return;
  });

  return Promise.all(tasks);
};


export default batchDownload;
