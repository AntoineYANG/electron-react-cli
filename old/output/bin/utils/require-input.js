/*
 * @Author: Kanata You
 * @Date: 2021-11-04 11:54:03
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-09 20:42:06
 */
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(resolve => {
      resolve(value); 
    }); 
  }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) {
      try {
        step(generator.next(value)); 
      } catch (e) {
        reject(e); 
      } 
    }

    function rejected(value) {
      try {
        step(generator.throw(value)); 
      } catch (e) {
        reject(e); 
      } 
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); 
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
import chalk from 'chalk';
import readline from 'readline';
import { requireBooleanInput, requireCheckBoxInput, requireOptionInput, requireStringInput } from './qa-ui.js';
import styles from './styles.js';
const requireInput = (properties, retell = false) => __awaiter(void 0, void 0, void 0, function *() {
  console.log(chalk`{${styles.pink} ┏═TABLE${'═'.repeat(25)}}`);
  const result = {};
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout
  });
  const ask = () => __awaiter(void 0, void 0, void 0, function *() {
    for (const [key, schema] of Object.entries(properties)) {
      yield new Promise(resolve => __awaiter(void 0, void 0, void 0, function *() {
        let _a; let _b; let _c; let _d; let _e; let _f;

        if (((_a = schema.onlyIf) === null || _a === void 0 ? void 0 : _a.call(schema, result)) === false) {
          resolve();
          return;
        }
        const name = (_b = schema.alias) !== null && _b !== void 0 ? _b : key.split('').map((s, i) => (i === 0 ? s.toLocaleUpperCase() : s)).join('');
        const defaultValue = schema.defaultValue ? `(${schema.defaultValue}) ` : '';
        let val = undefined;

        switch ((_c = schema.type) !== null && _c !== void 0 ? _c : 'string') {
          case 'boolean': {
            val = yield requireBooleanInput(name, (_d = schema.defaultValue) !== null && _d !== void 0 ? _d : false, schema, rl);
            break;
          }

          case 'option': {
            if (((_e = schema.options) !== null && _e !== void 0 ? _e : []).length) {
              val = yield requireOptionInput(name, schema.options, schema);
            }
            break;
          }

          case 'checkbox': {
            if (((_f = schema.options) !== null && _f !== void 0 ? _f : []).length) {
              val = yield requireCheckBoxInput(name, schema.options, schema);
            }
            break;
          }

          default: {
            val = yield requireStringInput(name, defaultValue, schema, rl);
          }
        }
        result[key] = val;
        resolve();
      }));
      yield new Promise(r => setTimeout(r, 120));
    }
    console.log(chalk`{${styles.pink} │ ${'╍'.repeat(28)}}`);
    const display = JSON.stringify(result, undefined, 2).split('\n').map(line => chalk`{${styles.pink} │} {${styles.white} ${line}}`).join('\n');
    console.log(display);

    if (retell) {
      console.log(chalk`{${styles.pink} │ ${'╌'.repeat(28)}}`);
      const ok = yield requireBooleanInput(' Is this OK?', true, {
        defaultValue: true
      }, rl);

      if (!ok) {
        console.log(chalk`{${styles.pink} ├${'─'.repeat(30)}}`);
        yield ask();
      }
    }
  });
  yield ask();
  console.log(chalk`{${styles.pink} ╘${'═'.repeat(31)}}`);
  return result;
});
export default requireInput;
// # sourceMappingURL=require-input.js.map
