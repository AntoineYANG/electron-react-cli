/*
 * @Author: Kanata You
 * @Date: 2021-11-08 22:18:40
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 16:44:55
 */
import chalk from 'chalk';
const white = 'rgb(250,250,250)';
const gray = 'rgb(188,188,188)';
const pink = 'rgb(248,157,198)';
const blue = 'rgb(14,58,206)';
const blueBright = 'rgb(76,126,225)';
const cyan = 'rgb(172,243,249)';
const red = 'rgb(225,46,49)';
const greenBright = 'rgb(160,250,163)';
const yellow = 'rgb(253,253,71)';
const fit = (a, n) => {
    if (a.length >= n) {
        return a.slice(0, n);
    }
    const left = Math.floor((n - a.length) / 2);
    return ' '.repeat(left) + a + ' '.repeat(n - a.length - left);
};
const board = (str) => {
    const lines = str.split('\n');
    const a = Math.floor((lines[1].length + 4) / 4);
    const b = lines[1].length / 2 + 2 - a;
    const formatted = lines.map((s, i) => {
        if (i === 0) {
            const al = [Math.round(a / 3), Math.round(a * 2 / 3), a];
            for (let j = 2; j >= 1; j--) {
                al[j] -= al[j - 1];
            }
            const bl = [
                Math.round(b / 7),
                Math.round(b * 3 / 7),
                Math.round(b * 5 / 7),
                b
            ];
            for (let j = 3; j >= 1; j--) {
                bl[j] -= bl[j - 1];
            }
            const head = ('▁'.repeat(al[0]) +
                '▂'.repeat(al[1]) +
                '▃'.repeat(al[2]) +
                '▄'.repeat(bl[0]) +
                '▃'.repeat(bl[1]) +
                '▂'.repeat(bl[2]) +
                '▁'.repeat(bl[3]));
            const head2 = (chalk.bgRgb(153, 204, 234).rgb(247, 237, 239)('▅'.repeat(al[0]) +
                '▆'.repeat(al[1]) +
                '▇'.repeat(al[2])) +
                chalk.rgb(153, 204, 234).bgRgb(247, 237, 239)('▁'.repeat(bl[0])) +
                chalk.bgRgb(153, 204, 234).rgb(247, 237, 239)('▇'.repeat(bl[1]) +
                    '▆'.repeat(bl[2]) +
                    '▅'.repeat(bl[3])));
            const head2r = (chalk.bgRgb(153, 204, 234).rgb(247, 237, 239)('▅'.repeat(bl[3]) +
                '▆'.repeat(bl[2]) +
                '▇'.repeat(bl[1])) +
                chalk.rgb(153, 204, 234).bgRgb(247, 237, 239)('▁'.repeat(bl[0])) +
                chalk.bgRgb(153, 204, 234).rgb(247, 237, 239)('▇'.repeat(al[2]) +
                    '▆'.repeat(al[1]) +
                    '▅'.repeat(al[0])));
            const head2s = (chalk.bgRgb(153, 204, 234).rgb(250, 250, 250)('▆'.repeat(al[1]) +
                '▇'.repeat(al[2])) +
                chalk.rgb(153, 204, 234).bgRgb(250, 250, 250)(' '.repeat(bl[0])) +
                chalk.bgRgb(153, 204, 234).rgb(250, 250, 250)('▇'.repeat(bl[1]) +
                    '▆'.repeat(bl[2]) +
                    '▅'.repeat(bl[3])));
            const head2sr = (chalk.bgRgb(153, 204, 234).rgb(250, 250, 250)('▅'.repeat(bl[3]) +
                '▆'.repeat(bl[2]) +
                '▇'.repeat(bl[1])) +
                chalk.rgb(153, 204, 234).bgRgb(250, 250, 250)(' '.repeat(bl[0])) +
                chalk.bgRgb(153, 204, 234).rgb(250, 250, 250)('▇'.repeat(al[2]) +
                    '▆'.repeat(al[1])));
            return '\n' + chalk.bgRgb(0, 0, 0)('  ' + chalk.rgb(153, 204, 234)(head + ' '.repeat((a + b) * 2 - head.length * 2) + head.split('').reverse().join('')) + '  ') + '\n' + (chalk.rgb(153, 204, 234)('██') + (head2 + ' '.repeat((a + b) * 2 - head.length * 2) + head2r) + chalk.rgb(153, 204, 234)('██')) + '\n' + (chalk.bgRgb(255, 245, 242).rgb(153, 204, 234)('▍ ') + (chalk.rgb(153, 204, 234)('██') + (head2s + ' '.repeat((a + b) * 2 - head.length * 2) + head2sr) + chalk.rgb(153, 204, 234)('██')) + chalk.rgb(255, 245, 242).bgRgb(153, 204, 234)('█▍')) + '\n' + (chalk.bgRgb(255, 245, 242).rgb(153, 204, 234)('▍ ') + (chalk.bgRgb(250, 250, 250).rgb(153, 204, 234)('▍ ')) + chalk.bgRgb(250, 250, 250).rgb(221, 106, 171)(' '.repeat((a + b) * 2 - 4)) + (chalk.rgb(250, 250, 250).bgRgb(153, 204, 234)('█▍')) + chalk.rgb(255, 245, 242).bgRgb(153, 204, 234)('█▍'));
        }
        else if (i === lines.length - 1) {
            const s = Math.floor(lines[1].length / 4) + 6;
            const t = lines[1].length + 8 - s * 2;
            const sl = [Math.round(s / 4), Math.round(s / 2), Math.round(s * 3 / 4), s];
            for (let j = 3; j >= 1; j--) {
                sl[j] -= sl[j - 1];
            }
            const before = ('▄'.repeat(sl[0]) +
                '▃'.repeat(sl[1]) +
                '▂'.repeat(sl[2]) +
                '▁'.repeat(sl[3]));
            const tail = ('█'.repeat(sl[0]) +
                '▇'.repeat(sl[1]) +
                '▆'.repeat(sl[2]) +
                '▅'.repeat(sl[3]));
            return chalk.rgb(153, 204, 234).bgRgb(250, 250, 250)(before.split('').map((d, i) => i === 0 || i === 2 ? '█' : d).join('') +
                ' '.repeat(t) +
                before.slice(0, before.length - 3).split('').reverse().join('') +
                '█' + before.charAt(1) + '█') + '\n' + chalk.bgRgb(153, 204, 234).rgb(0, 0, 0)(tail + '▄'.repeat(t) + tail.split('').reverse().join(''));
        }
        return chalk.bgRgb(255, 245, 242).rgb(153, 204, 234)('▍ ') + (chalk.bgRgb(250, 250, 250).rgb(153, 204, 234)('▍ ')) + (chalk.bgRgb(250, 250, 250).rgb(221, 106, 171)(fit(s, (a + b) * 2 - 4))) + (chalk.rgb(250, 250, 250).bgRgb(153, 204, 234)('█▍')) + chalk.rgb(255, 245, 242).bgRgb(153, 204, 234)('█▍');
    }).join('\n');
    return formatted + '\n';
};
const styles = {
    board,
    white,
    gray,
    pink,
    cyan,
    blue,
    blueBright,
    red,
    greenBright,
    yellow
};
export default styles;
//# sourceMappingURL=styles.js.map