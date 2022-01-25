"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-25 19:34:45
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-25 22:17:09
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path = require("path");

const fs = require("fs");

const mkdirp_1 = require("mkdirp");

const inquirer = require("inquirer");

const _env_1 = require("../../../../utils/env");

const copy = (dir, dest) => {
  if (!fs.existsSync(dest)) {
    (0, mkdirp_1.sync)(dest);
  }

  fs.readdirSync(dir).forEach(n => {
    const source = path.join(dir, n);
    const target = path.join(dest, n);

    if (fs.statSync(source).isDirectory()) {
      copy(source, target);
    } else {
      fs.copyFileSync(source, target);
    }
  });
};

const reactAppTemplate = {
  name: 'React17 app',
  create: async (name, enableTS) => {
    const dir = _env_1.default.resolvePathInPackage(name);

    (0, mkdirp_1.sync)(path.join(dir, 'configs'));
    (0, mkdirp_1.sync)(path.join(dir, 'scripts'));
    (0, mkdirp_1.sync)(path.join(dir, 'tasks'));
    (0, mkdirp_1.sync)(path.join(dir, 'src'));
    (0, mkdirp_1.sync)(path.join(dir, 'public', 'images')); // public dir

    ['favicon.ico', 'logo192.png', 'logo512.png', 'manifest.json', 'robots.txt'].forEach(n => {
      const source = path.join(__dirname, '..', '..', '..', '..', '..', 'public', n);
      fs.copyFileSync(source, path.join(dir, 'public', n));
    });
    fs.writeFileSync(path.join(dir, 'public', 'index.html'), `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using espoir"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>${name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`, {
      encoding: 'utf-8'
    });
    const {
      useSass
    } = await inquirer.prompt([{
      type: 'confirm',
      name: 'useSass',
      message: 'Use sass?'
    }]);
    (0, mkdirp_1.sync)(path.join(dir, 'src', 'components'));
    (0, mkdirp_1.sync)(path.join(dir, 'src', 'context'));
    (0, mkdirp_1.sync)(path.join(dir, 'src', 'typings'));
    (0, mkdirp_1.sync)(path.join(dir, 'src', 'utils'));
    (0, mkdirp_1.sync)(path.join(dir, 'src', 'views'));
    fs.writeFileSync(path.join(dir, 'src', enableTS ? 'index.tsx' : 'index.jsx'), `/** ESPOIR TEMPLATE */
      
import React from 'react';
import ReactDOM from 'react-dom';
import App from '${enableTS ? '@views' : './views'}';

import './index.${useSass ? 'scss' : 'css'}';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
`, {
      encoding: 'utf-8'
    });
    fs.writeFileSync(path.join(dir, 'src', useSass ? 'index.scss' : 'index.css'), `/** ESPOIR TEMPLATE */
      
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  background-color: #000;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

.App {
  text-align: center;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}
`, {
      encoding: 'utf-8'
    });
    fs.writeFileSync(path.join(dir, 'src', 'views', enableTS ? 'index.tsx' : 'index.jsx'), `/** ESPOIR TEMPLATE */
      
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';


const App${enableTS ? ': React.FC' : ''} = () => (
  <Router>
    <Routes>
      <Route path="/" element={ <></> } />
    </Routes>
  </Router>
);

export default App;
`, {
      encoding: 'utf-8'
    });

    if (enableTS) {
      fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({
        extends: '../../tsconfig.base.json',
        include: ['./src/**/*'],
        exclude: ['node_modules', '.modules'],
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noFallthroughCasesInSwitch: true,
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          baseUrl: '.',
          paths: {
            '@components/*': ['./src/components/*'],
            '@context/*': ['./src/context/*'],
            '@views': ['./src/views/'],
            '@views/*': ['./src/views/*'],
            '@objects': ['./src/objects'],
            '@objects/*': ['./src/objects/*'],
            '@utils/*': ['./src/utils/*'],
            '@public/*': ['./public/*']
          }
        }
      }, undefined, 2) + '\n', {
        encoding: 'utf-8'
      });
    }

    const packageJSON = { ...require(path.join(dir, 'package.json')),
      dependencies: {
        '@babel/core': '^7.16.12',
        '@babel/runtime': '7.12.1',
        '@pmmmwh/react-refresh-webpack-plugin': '^0.5.4',
        'babel-loader': '^8.2.3',
        'babel-plugin-named-asset-import': '^0.3.8',
        'babel-preset-react-app': '10.0.1',
        browserslist: '^4.19.1',
        'case-sensitive-paths-webpack-plugin': '^2.4.0',
        chalk: '^5.0.0',
        'css-loader': '^6.5.1',
        eslint: '^8.7.0',
        'eslint-config-react-app': '^7.0.0',
        'eslint-webpack-plugin': '^3.1.1',
        'file-loader': '^6.2.0',
        'fs-extra': '^9.1.0',
        'html-webpack-plugin': '^5.5.0',
        'mini-css-extract-plugin': '^0.11.3',
        postcss: '^8.4.5',
        'postcss-loader': '^6.2.1',
        'postcss-normalize': '^10.0.1',
        'postcss-preset-env': '^7.2.3',
        'postcss-safe-parser': '^6.0.0',
        react: '^17',
        'react-dev-utils': '^12.0.0',
        'react-dom': '^17',
        'react-router-dom': '^6.2.1',
        resolve: '^1.22.0',
        'resolve-url-loader': '^5.0.0',
        sass: '^1.49.0',
        'sass-loader': '^12.4.0',
        'url-loader': '^4.1.1',
        webpack: '^5.67.0',
        'webpack-manifest-plugin': '^4.1.1'
      },
      devDependencies: enableTS ? {
        '@types/react': '>=17',
        '@types/react-dom': '>=17',
        '@types/react-router-dom': '>=5',
        ajv: '^8.8.2',
        'react-refresh': '^0.11.0',
        'style-loader': '^3.3.1',
        typescript: '>=4',
        'webpack-dev-server': '^4.7.3'
      } : {
        ajv: '^8.8.2',
        'react-refresh': '^0.11.0',
        'style-loader': '^3.3.1',
        'webpack-dev-server': '^4.7.3'
      },
      eslintConfig: {
        extends: ['react-app', 'react-app/jest']
      },
      browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
      },
      babel: {
        presets: ['react-app']
      },
      alias: {
        '@components': './src/components/',
        '@context': './src/context/',
        '@views': './src/views/',
        '@utils': './src/utils/',
        '@public': './public/'
      }
    };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJSON, undefined, 2) + '\n', {
      encoding: 'utf-8'
    }); // scripts

    copy(path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'react-app-scripts'), path.join(dir, 'scripts')); // configs

    fs.writeFileSync(path.join(dir, 'configs', 'path.json'), JSON.stringify({
      rootDir: '.',
      template: 'public/index.html',
      src: 'src',
      entry: `index.${enableTS ? 't' : 'j'}sx`,
      referencePath: '.',
      publicPath: 'public',
      output: 'build'
    }, undefined, 2) + '\n');
    fs.writeFileSync(path.join(dir, 'configs', 'env.json'), JSON.stringify({
      APP_NAME: 'homepage'
    }, undefined, 2) + '\n');
  }
};
exports.default = reactAppTemplate;