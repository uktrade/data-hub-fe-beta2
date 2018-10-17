const { isEmpty, set } = require('lodash')

const { getNextPath } = require('./helpers')
const state = require('./state/current')
const { getErrors } = require('./errors')

const postDetails = async (req, res, next) => {
  const { currentStep, key, successMessage } = res.locals.journey
  const errors = getErrors(currentStep.macro(res.locals).children, req.body)

  if (!isEmpty(errors)) {
    set(res.locals, 'form.errors.messages', errors)
    state.update(req.session, key, currentStep.path, { completed: false })
    return next()
  }

  if (currentStep.send) {
    const data = state.reduceSteps(req.session, key)
    await currentStep.send(data, (err) => {
      if (err) {
        state.update(req.session, key, currentStep.path, { completed: false })
        if (err.statusCode === 400) {
          set(res.locals, 'form.errors.messages', err.error)
          return next()
        } else {
          return next(err)
        }
      }

      state.remove(req.session, key)
      req.flash('success', successMessage)
      res.redirect(req.baseUrl + getNextPath(currentStep, req.body))
    })
  } else {
    state.update(req.session, key, currentStep.path, { completed: true })
    res.redirect(req.baseUrl + getNextPath(currentStep, req.body))
  }
}

module.exports = {
  postDetails,
}
