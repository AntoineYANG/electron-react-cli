"use strict";
/*
 * @Author: Kanata You
 * @Date: 2022-01-23 21:48:40
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-01-23 22:40:03
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
  name: 'React app',
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
  Switch,
  Route
} from 'react-router-dom';

// import PageA from './page-a';


const App${enableTS ? ': React.FC' : ''} = () => (
  <Router>
    <Switch>
      <Route path="/" >
        {/* <PageA /> */}
      </Route>
    </Switch>
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
        react: '>=17',
        'react-dom': '>=17',
        'react-router-dom': '>=5.3',
        '@babel/core': '>=7.12.3',
        '@pmmmwh/react-refresh-webpack-plugin': '0.4.3',
        '@svgr/webpack': '5.5.0',
        '@typescript-eslint/eslint-plugin': '^4.5.0',
        '@typescript-eslint/parser': '^4.5.0',
        'babel-eslint': '^10.1.0',
        'babel-jest': '^26.6.0',
        'babel-loader': '8.1.0',
        'babel-plugin-named-asset-import': '^0.3.7',
        'babel-preset-react-app': '^10.0.0',
        bfj: '^7.0.2',
        camelcase: '^6.1.0',
        'case-sensitive-paths-webpack-plugin': '2.3.0',
        'cra-template-typescript': '1.1.2',
        'css-loader': '4.3.0',
        dotenv: '8.2.0',
        'dotenv-expand': '5.1.0',
        eslint: '^7.11.0',
        'eslint-config-react-app': '^6.0.0',
        'eslint-plugin-flowtype': '^5.2.0',
        'eslint-plugin-import': '^2.22.1',
        'eslint-plugin-jest': '^24.1.0',
        'eslint-plugin-jsx-a11y': '^6.3.1',
        'eslint-plugin-react': '^7.21.5',
        'eslint-plugin-react-hooks': '^4.2.0',
        'eslint-plugin-testing-library': '^3.9.2',
        'eslint-webpack-plugin': '^2.5.2',
        'file-loader': '6.1.1',
        'fs-extra': '^9.0.1',
        'html-webpack-plugin': '4.5.0',
        'identity-obj-proxy': '3.0.0',
        jest: '26.6.0',
        'jest-circus': '26.6.0',
        'jest-resolve': '26.6.0',
        'jest-watch-typeahead': '0.6.1',
        'mini-css-extract-plugin': '0.11.3',
        'optimize-css-assets-webpack-plugin': '5.0.4',
        'pnp-webpack-plugin': '1.6.4',
        'postcss-flexbugs-fixes': '4.2.1',
        'postcss-loader': '3.0.0',
        'postcss-normalize': '8.0.1',
        'postcss-preset-env': '6.7.0',
        'postcss-safe-parser': '5.0.2',
        prompts: '2.4.0',
        'react-app-polyfill': '^2.0.0',
        'react-dev-utils': '^11.0.3',
        'react-refresh': '^0.8.3',
        resolve: '1.18.1',
        'resolve-url-loader': '^3.1.2',
        ...(useSass ? {
          'sass': '^1.40.1',
          'sass-loader': '^10.0.5'
        } : {}),
        semver: '7.3.2',
        'style-loader': '1.3.0',
        'terser-webpack-plugin': '4.2.3',
        'tga-js': '^1.1.1',
        'ts-pnp': '1.2.0',
        'url-loader': '4.1.1',
        webpack: '4.44.2',
        'webpack-dev-server': '3.11.1',
        'webpack-manifest-plugin': '2.2.0',
        'workbox-webpack-plugin': '5.1.4'
      },
      devDependencies: enableTS ? {
        typescript: '>=4',
        '@types/react': '>=17',
        '@types/react-dom': '>=17',
        '@types/react-router-dom': '>=5'
      } : {},
      eslintConfig: {
        extends: ['react-app', 'react-app/jest']
      },
      browserslist: {
        production: ['>0.2%', 'not dead', 'not op_mini all'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
      },
      jest: {
        roots: ['<rootDir>/src'],
        collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
        setupFiles: ['react-app-polyfill/jsdom'],
        setupFilesAfterEnv: [],
        testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
        testEnvironment: 'jsdom',
        testRunner: 'D:\\project\\@github-KANATA\\haku\\node_modules\\jest-circus\\runner.js',
        transform: {
          '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/config/jest/babelTransform.js',
          '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
          '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js'
        },
        transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$'],
        modulePaths: [],
        moduleNameMapper: {
          '^react-native$': 'react-native-web',
          '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
        },
        moduleFileExtensions: ['web.js', 'js', 'web.ts', 'ts', 'web.tsx', 'tsx', 'json', 'web.jsx', 'jsx', 'node'],
        watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
        resetMocks: true
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

    copy(path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'react-app-configs'), path.join(dir, 'configs'));
    fs.writeFileSync(path.join(dir, 'configs', 'path.json'), JSON.stringify({
      rootDir: '.',
      template: 'public/index.html',
      src: 'src',
      entry: `index.${enableTS ? 't' : 'j'}sx`,
      publicPath: '.',
      output: 'build'
    }));
  }
};
exports.default = reactAppTemplate;