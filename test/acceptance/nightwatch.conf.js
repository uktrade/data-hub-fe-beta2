require('dotenv').config()
const seleniumServer = require('selenium-server')
const chromeDriver = require('chromedriver')
const path = require('path')

require('nightwatch-cucumber')({
  cucumberArgs: [
    '--require', 'test/acceptance/global.cucumber.js',
    '--require', 'test/acceptance/features',
    '--format', 'json:cucumber/reports/tests.json',
    process.env.FEATURES_FOLDER || 'test/acceptance/features',
  ],
})

module.exports = {
  custom_commands_path: [
    'node_modules/nightwatch-custom-commands-assertions/js/commands',
    path.resolve(__dirname, 'commands'),
  ],
  custom_assertions_path: [
    'node_modules/nightwatch-custom-commands-assertions/js/assertions',
  ],
  page_objects_path: path.resolve(__dirname, 'pages'),
  globals_path: path.resolve(__dirname, 'global.nightwatch.js'),
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    host: process.env.QA_SELENIUM_HOST,
    port: process.env.QA_SELENIUM_PORT,
    cli_args: {
      'webdriver.chrome.driver': chromeDriver.path,
    },
  },
  test_settings: {
    default: {
      launch_url: '',
      desiredCapabilities: {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        javascriptEnabled: true,
      },
    },
    circleci: {
      screenshots: {
        enabled: true,
        on_failure: true,
        path: path.resolve(__dirname, 'screenshots'),
      },
      desiredCapabilities: {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        acceptSslCerts: true,
        javascriptEnabled: true,
        chromeOptions: {
          args: [
            'headless',
            'disable-gpu',
            '--no-sandbox',
          ],
        },
      },
    },
  },
}
