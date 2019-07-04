/* eslint-disable */
const WdioImage = require ('@uktrade/wdio-image-diff-js').default
const browserstack = require('browserstack-local')
const { addAttachment } = require('@wdio/allure-reporter').default

const IMPLICIT_TIMEOUT = process.env.WDIO_IMPLICIT_TIMEOUT || 90000
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const browserStackUser = process.env.BROWSERSTACK_USERNAME || ''
const browserStackKey = process.env.BROWSERSTACK_ACCESS_KEY || ''
const isRemote = !!process.env.IS_REMOTE
let testName = 'undefined'

const remoteConfig = {
  services: ['browserstack'],
  user: browserStackUser,
  key: browserStackKey,
  browserstackLocal: true,
  // Code to start browserstack local before start of test
  onPrepare: function () {
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.key }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');
        resolve();
      });
    });
  },
  // Code to stop browserstack local after end of test
  onComplete: function () {
    exports.bs_local.stop(function() {});
  },
  capabilities: [
    {
    'os': 'Windows',
    'os_version': '10',
    'browser': 'Chrome',
    'browser_version': '76.0 beta',
    'resolution': '1920x1080'
  }]
}

const localConfig = {
  path: '/'
}

const defaultConfig = {
  specs: [
    './test/visual/specs/**/*.js',
  ],
  maxInstances: 10,
  capabilities: [{ browser: 'Chrome' }],
  logLevel: 'error',
  bail: 0,
  baseUrl: BASE_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  framework: 'mocha',
  reporters: ['spec', ['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: true,
  }]],
  mochaOpts: {
    timeout: 60000,
  },
  before: () => {
    browser.setTimeout({ 'implicit': IMPLICIT_TIMEOUT })
    const wdioImageDiff = new WdioImage(browser, { threshold: 0.1, width: 1792, height: 1008, })
    browser.imageDiff = wdioImageDiff
  },
  beforeTest: (test) => {
    testName = `${test.fullTitle} - ${browser.capabilities.browserName}`
    browser.imageDiff.testName = testName
  },
  afterEach: () => {
    const fs = require('fs')
    const path = require('path')
    const filepath = path.join(`/Users/filipporaimondi/code/data-hub-frontend/visual-screenshots/baseline/${testName}.png`)

    fs.readFile(filepath, function(err, data) {
      if (err) throw err
      addAttachment('Baseline', Buffer.from(data, 'base64'))
    })
  }
}

exports.config = isRemote
  ? Object.assign({}, defaultConfig, remoteConfig)
  : Object.assign({}, defaultConfig, localConfig)
