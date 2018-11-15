const state = require('./state/current')

module.exports = () => {
  return (req, res, next) => {
    req.currentJourney = {
      getField (fieldName) {
        return state.getField(req.session, res.locals.journey.key, fieldName)
      },
    }

    next()
  }
}
