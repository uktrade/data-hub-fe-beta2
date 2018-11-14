const { isEmpty, set, forEach, get } = require('lodash')

const { getNextPath, joinPaths } = require('./helpers')
const state = require('./state/current')
const { getErrors } = require('./errors')

const setJourneyDetails = (journey, currentStep, currentStepId) => {
  return (req, res, next) => {
    res.locals.journey = {
      currentStep,
      currentStepId,
      ...journey,
      key: joinPaths([ req.baseUrl, journey.steps[0].path ]),
    }

    next()
  }
}

const postDetails = async (req, res, next) => {
  const { currentStep, key } = res.locals.journey
  const errors = getErrors(currentStep.macro(res.locals).children, req.body)

  if (!isEmpty(errors)) {
    set(res.locals, 'form.errors.messages', errors)
    state.update(req.session, key, currentStep.path, { completed: false })
    return next()
  }

  if (currentStep.done) {
    const data = state.reduceSteps(req.session, key)

    try {
      const response = await currentStep.done.send(data)

      state.remove(req.session, key)
      req.flash('success', currentStep.done.message)
      res.redirect(joinPaths([ res.locals.returnLink, currentStep.done.nextPath(response) ]))
    } catch (err) {
      state.update(req.session, key, currentStep.path, { completed: false })
      if (err.statusCode === 400) {
        set(res.locals, 'form.errors.messages', err.error)
        return next()
      } else {
        return next(err)
      }
    }
  } else {
    const nextPath = getNextPath(currentStep, req.body)
    state.update(req.session, key, currentStep.path, { completed: true, nextPath })
    res.redirect(joinPaths([ req.baseUrl, nextPath ]))
  }
}

const setBreadcrumbs = (req, res, next) => {
  const breadcrumbs = [
    ...(res.locals.journey.breadcrumbs || []),
    ...(res.locals.journey.currentStep.breadcrumbs || []),
  ]

  forEach(breadcrumbs, (breadcrumb) => {
    res.breadcrumb(breadcrumb.name, breadcrumb.url)
  })

  next()
}

const renderTemplate = (req, res) => {
  const { type, heading, macro } = res.locals.journey.currentStep

  res.render(`_layouts/${type}`, {
    heading,
    form: {
      ...res.locals.form,
      ...macro({
        ...res.locals,
        errors: get(res.locals, 'form.errors.messages'),
        state: get(res.locals, 'form.state'),
        returnLink: get(res.locals, 'form.returnLink'),
        returnText: get(res.locals, 'form.returnText'),
      }),
    },
  })
}

module.exports = {
  setJourneyDetails,
  postDetails,
  setBreadcrumbs,
  renderTemplate,
}
