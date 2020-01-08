const { isNil, isString, pickBy } = require('lodash')
const request = require('request')
const requestPromise = require('request-promise')

const config = require('../config')
const logger = require('../config/logger')

function hasValue(value) {
  return !isNil(value)
}

function stripScript(text) {
  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  while (SCRIPT_REGEX.test(text)) {
    logger.warn('Found script tag in response')
    text = text.replace(SCRIPT_REGEX, '')
  }
  return text
}

function stripScripts(key, value) {
  if (isString(value)) {
    return stripScript(value)
  }
  return value
}

function parseOptions(opts, token) {
  const defaults = {
    headers: {
      ...opts.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    json: true,
    method: 'GET',
    proxy: process.env.PROXY,
  }

  if (isString(opts)) {
    return {
      ...defaults,
      url: opts,
    }
  }

  return {
    ...defaults,
    body: opts.body,
    method: opts.method || 'GET',
    qs: pickBy(opts.qs, hasValue),
    url: opts.url,
  }
}

// Accepts options as keys on an object or encoded as a url
// Responses are parsed to remove any embedded XSS attempts with
// script tags
function authorisedRequest(token, opts) {
  const requestOptions = parseOptions(opts, token)

  logger.debug('Send authorised request: ', requestOptions)
  requestOptions.jsonReviver = stripScripts

  return requestPromise(requestOptions)
}

// Accepts options as keys on an object or encoded as a url
// Responses are not parsed for XSS attacks
// See request-promise #90 does not work with streams
// https://github.com/request/request-promise/issues/90
function authorisedRawRequest(token, opts) {
  const requestOptions = parseOptions(opts, token)

  logger.debug('Send authorised raw request: ', requestOptions)

  return Promise.resolve(request(requestOptions))
}

// accept untrusted certificates for dev environments
if (config.isDev && process.env.PROXY) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

module.exports = {
  authorisedRequest,
  authorisedRawRequest,
}
