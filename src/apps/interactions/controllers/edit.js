/* eslint camelcase: 0 */
const { get, lowerCase, snakeCase } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionForm, serviceDeliveryForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getInteractionOptions } = require('../services/interaction-options')

const formConfigs = {
  'interaction': interactionForm,
  'service-delivery': serviceDeliveryForm,
}

async function getHiddenFields (req, res, interactionId) {
  const hiddenFields = {
    id: interactionId,
    company: get(res.locals, 'company.id'),
    investment_project: get(res.locals, 'investmentData.id'),
    kind: snakeCase(req.params.kind),
  }

  return hiddenFields
}

async function buildForm (req, res, interactionId) {
  const options = await getInteractionOptions(req, res)
  const hiddenFields = await getHiddenFields(req, res, interactionId)

  const formProperties = {
    ...options,
    returnLink: interactionId ? `/interactions/${interactionId}` : res.locals.returnLink,
    returnText: interactionId ? 'Return without saving' : 'Cancel',
    buttonText: interactionId ? 'Save and return' : `Add ${lowerCase(req.params.kind)}`,
    hiddenFields,
  }

  const form = formConfigs[req.params.kind](formProperties)
  return form
}

function getMergedData (req, res) {
  const user = get(req.session, 'user')
  const interactionData = transformInteractionResponseToForm(res.locals.interaction)

  const interactionDefaults = {
    dit_adviser: user.id,
    date: transformDateStringToDateObject(new Date()),
    contact: get(res.locals, 'contact.id'),
    dit_team: get(user, 'dit_team.id'),
  }

  const mergedInteractionData = {
    ...interactionDefaults,
    ...interactionData,
    ...res.locals.requestBody,
  }

  return mergedInteractionData
}

async function renderEditPage (req, res, next) {
  try {
    const interactionId = get(req.params, 'interactionId')
    const mergedInteractionData = getMergedData(req, res)
    const form = await buildForm(req, res, interactionId)
    const errors = get(res.locals, 'form.errors.messages')

    const interactionForm = buildFormWithStateAndErrors(form, mergedInteractionData, errors)

    const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''
    const kindName = lowerCase(req.params.kind)
    const title = interactionId ? `Edit ${kindName}` : `Add ${kindName + forEntityName}`

    res
      .breadcrumb(`${interactionId ? 'Edit' : 'Add'} ${kindName}`)
      .title(title)
      .render('interactions/views/edit', {
        interactionForm,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditPage,
}
