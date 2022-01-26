/*
 * @Author: Kanata You 
 * @Date: 2022-01-26 16:45:07 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-26 16:48:25
 */

import RunnableScript from '@runnable';
import update from '@@su/scripts/update';


const SelfUpdate: RunnableScript = {
  fullName: 'update',
  displayName: 'update',
  aliases: [],
  description: 'Update espoir-cli',
  usage: '',
  args: [],
  options: [],
  exec: async () => {

    return update();
  }
};

export default SelfUpdate;
