/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const { startReactDev } = require('./react_start');
const openBrowser = require('react-dev-utils/openBrowser');

const run = ({ url }) => {
  openBrowser(url);
};

startReactDev(run).then(run);
