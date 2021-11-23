/*
 * @Author: Kanata You 
 * @Date: 2021-11-10 22:13:33 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-11-11 00:34:19
 */

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const __package = path.resolve(__dirname, '..');
const isProd = process.env.NODE_ENV === 'production';


/**
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  mode:   isProd ? 'production' : 'development',
  entry:  '../src/index.ts',
  output: {
    path:     path.resolve(__package, 'bin'),
    filename: 'index.js',
    // library: {
    //   type: 'commonjs2',
    //   name: 'espoir'
    // }
  },
  module: {
    rules: [
      // ts-loader
      {
        test:    /\.ts$/,
        loader:  'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__package, 'tsconfig.json')
        }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias:      {

    }
  },
  performance: {
    hints:             'warning',
    maxAssetSize:      200_000,
    maxEntrypointSize: 400_000,
    assetFilter:       assetFilename => /\.(js)$/.test(assetFilename)
  },
  devtool: 'source-map',
  context: __dirname,
  target:  'node14.0',
  // externals: [],
  // externalsType: 'var',
  // externalsPresets: {
  //   electron: false,
  //   electronMain: false,
  //   electronPreload: false,
  //   electronRenderer: false,
  //   node: true,
  //   nwjs: true,
  //   web: false,
  //   webAsync: false
  // },
  plugins: [new CleanWebpackPlugin() // clear output dict before compiling
  ],
  optimization: {
    minimize: true
  }
};


/**
 * @type {import('webpack').Configuration}
 */
const buildConfig = Object.assign(
  {},
  commonConfig,
  isProd ? {} : {}
);

module.exports = buildConfig;
