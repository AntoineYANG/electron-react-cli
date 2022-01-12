/*
 * @Author: Kanata You 
 * @Date: 2021-12-02 18:09:51 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-12 21:03:55
 */

import RunnableScript from '@runnable';
import commit from '@@contribute/scripts/commit';


const Contribute: RunnableScript = {
  fullName: 'contribute',
  displayName: 'contribute',
  aliases: ['c', 'contr', 'cont', 'commit'],
  description: 'Modify the changes and commit them',
  usage: '',
  args: [],
  options: [],
  exec: async () => {

    return commit();
  }
};

export default Contribute;
