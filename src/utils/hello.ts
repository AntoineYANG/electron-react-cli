/*
 * @Author: Kanata You 
 * @Date: 2021-11-04 16:18:24 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 03:27:12
 */

import chalk from 'chalk';
import styles from './styles';


const hello = (title: string) => {
  console.clear();
//   console.info(styles.board(`
// ${'                      '}
// ${'   ▄                  '}
// ${'    ██        ▄▄▀▀    '}
// ${'    ██       ▀▄▄      '}
// ${'                ▀▀    '}
// ${'   ▀ ▀         ▀ ▀    '}
// ${'       ▀▄▄▄▄▀         '}
// ${'                      '}
// `)
//   );
  console.info(
chalk`
{${styles.pink} |                             }
{${styles.pink} |         {bold espoir cli}      }
{${styles.pink} |                             }
{${styles.pink} |            ${VERSION}    }
{${styles.pink} |            by {underline ${AUTHOR}}    }
{${styles.pink} |                             }
{${styles.pink} ╰─────────────────────────────}

{${styles.blueBright} + ${title} ...}
`
  );
};

export default hello;
