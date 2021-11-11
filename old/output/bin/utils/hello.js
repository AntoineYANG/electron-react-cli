/*
 * @Author: Kanata You
 * @Date: 2021-11-04 16:18:24
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 16:41:49
 */
import chalk from 'chalk';
import styles from './styles.js';

const hello = title => {
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
  console.info(chalk`
{${styles.pink} |                             }
{${styles.pink} |         {bold espoir cli}      }
{${styles.pink} |                             }
{${styles.pink} |            ${'0.0.0-alpha-1.3.0'}    }
{${styles.pink} |            by {underline ${'kanatayou'}}    }
{${styles.pink} |                             }
{${styles.pink} ╰─────────────────────────────}

{${styles.cyan} + ${title} ...}
`);
};
export default hello;
// # sourceMappingURL=hello.js.map
