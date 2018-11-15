const config = require('../../config')
const { authorisedRequest } = require('../lib/authorised-request')

async function userMiddleware (req, res, next) {
  const token = req.session.token
  const userSession = req.session.user

  if (userSession) {
    res.locals.user = userSession
    return next()
  }

  if (!token) {
    return next()
  }

  try {
    const userResponse = await authorisedRequest(token, `${config.apiRoot}/whoami/`)

    req.session.user = res.locals.user = userResponse
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = userMiddleware
