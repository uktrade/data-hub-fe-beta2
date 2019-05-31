const request = require('request-promise')
const queryString = require('qs')
const uuid = require('uuid')
const axios = require('axios')

const { get, set, isUndefined } = require('lodash')

const { saveSession } = require('./../../lib/session-helper')
const config = require('./../../../config')

function getAccessToken (code) {
  const options = {
    method: 'POST',
    url: config.oauth.tokenFetchUrl,
    formData: {
      code,
      grant_type: 'authorization_code',
      client_id: config.oauth.clientId,
      client_secret: config.oauth.clientSecret,
      redirect_uri: config.oauth.redirectUri,
    },
    json: true,
  }

  return request(options)
}

function handleMissingState (req, res, next) {
  const sessionOAuthState = get(req.session, 'oauth.state')

  if (isUndefined(sessionOAuthState)) {
    return res.redirect('/oauth')
  }

  next()
}

async function getSSOUserProfile (token) {
  const options = {
    headers: { 'Authorization': 'Bearer ' + token },
  }

  const data = await axios.get(
    config.oauth.userProfileUrl,
    options,
  ).then((response) => response.data)
    .catch((error) => error)

  return data
}

async function callbackOAuth (req, res, next) {
  const errorQueryParam = get(req.query, 'error')
  const stateQueryParam = get(req.query, 'state')
  const sessionOAuthState = get(req.session, 'oauth.state')

  // Already been through OAuth
  if (get(req.session, 'token')) {
    return res.redirect('/')
  }

  // No state query param
  if (isUndefined(stateQueryParam)) {
    return next({ statusCode: 403 })
  }

  // Error query param present
  if (errorQueryParam) {
    return renderHelpPage(req, res, next)
  }

  // Session state does not match query param state
  if (sessionOAuthState !== stateQueryParam) {
    return next(Error('There has been an OAuth stateId mismatch sessionOAuthState'))
  }

  try {
    const data = await getAccessToken(req.query.code)
    const userProfile = await getSSOUserProfile(data.access_token)

    set(req, 'session.token', data.access_token)
    set(req, 'session.userProfile', userProfile)
    return res.redirect(req.session.returnTo || '/')
  } catch (error) {
    return next(error)
  }
}

async function redirectOAuth (req, res, next) {
  const stateId = get(req.session, 'oauth.state', uuid())
  const urlParams = {
    response_type: 'code',
    client_id: config.oauth.clientId,
    redirect_uri: config.oauth.redirectUri,
    state: stateId,
    idp: 'cirrus',
  }

  // As you are here you have not byPassed SSO and if the oAuthDevToken is present then pass it to the code parameter
  // that is sent to the SSO provider. When using the mock-sso app, the oAuthDevToken is simply passed through the
  // SSO journey
  const oAuthDevToken = get(config, 'oauth.devToken')

  // When using Mock SSO https://github.com/uktrade/mock-sso
  // and when the OAUTH_DEV_TOKEN env is set, then pass this token through the SSO process on the `code` param
  if (oAuthDevToken) {
    set(urlParams, 'code', oAuthDevToken)
  }

  try {
    // used to check the callback received contains matching state param
    set(req.session, 'oauth.state', stateId)
    await saveSession(req.session)
    res.redirect(`${config.oauth.url}?${queryString.stringify(urlParams)}`)
  } catch (error) {
    next(error)
  }
}

function renderHelpPage (req, res, next) {
  return res
    .render('oauth/views/help-page', {
      heading: 'You don\'t have permission to access this service',
    })
}

function signOutOAuth (req, res) {
  req.session = null
  res.clearCookie('datahub.sid')
  res.redirect(config.oauth.logoutUrl)
}

module.exports = {
  callbackOAuth,
  redirectOAuth,
  renderHelpPage,
  signOutOAuth,
  handleMissingState,
}
