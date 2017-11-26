const { getAdvisers } = require('./repos')

async function setAllAdvisers (req, res, next) {
  try {
    res.locals.advisers = await getAdvisers({ token: req.session.token })
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  setAllAdvisers,
}
