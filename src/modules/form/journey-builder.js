const express = require('express')

const {
  validateState,
  updateStateData,
  updateStateBrowseHistory,
  setFormDetails,
  invalidateStateForChangedNextPath,
  invalidateStateForDependentSteps,
} = require('./state/middleware')
const {
  setJourneyDetails,
  postDetails,
  setBreadcrumbs,
  renderTemplate,
} = require('./middleware')

function getMiddleware (currentStep) {
  return currentStep.middleware || []
}

const build = (journey) => {
  const router = express.Router()

  journey.steps.forEach((currentStep, currentStepId) => {
    router.route(currentStep.path)
      .get(
        setJourneyDetails(journey, currentStep, currentStepId),
        validateState,
        ...getMiddleware(currentStep),
        setFormDetails,
        updateStateBrowseHistory,
        setBreadcrumbs,
        renderTemplate,
      )
      .post(
        setJourneyDetails(journey, currentStep, currentStepId),
        validateState,
        ...getMiddleware(currentStep),
        invalidateStateForChangedNextPath,
        invalidateStateForDependentSteps,
        updateStateData,
        postDetails,
        setFormDetails,
        setBreadcrumbs,
        renderTemplate,
      )
  })

  return router
}

module.exports = {
  build,
}
