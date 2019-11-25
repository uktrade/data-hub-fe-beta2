/* eslint camelcase: 0 */
const { get, lowerCase, snakeCase, kebabCase } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionForm, serviceDeliveryForm } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { getInteractionOptions } = require('../services/interaction-options')
const { getReturnLink } = require('../helpers')
const { joinPaths } = require('../../../lib/path')

const formConfigs = {
  interaction: interactionForm,
  'service-delivery': serviceDeliveryForm,
}

async function getHiddenFields (req, res, interactionId) {
  const hiddenFields = {
    id: interactionId,
    company: get(res.locals, 'company.id'),
    investment_project: get(res.locals, 'investment.id'),
    kind: snakeCase(req.params.kind),
    theme: snakeCase(req.params.theme) || 'other',
  }

  return hiddenFields
}

async function buildForm (req, res, interactionId, validatedKind) {
  const options = await getInteractionOptions(req, res)
  const hiddenFields = await getHiddenFields(req, res, interactionId)
  const returnLink = joinPaths([ getReturnLink(res.locals.interactions), interactionId ])

  const formProperties = {
    ...options,
    hiddenFields,
    returnLink,
    returnText: interactionId ? 'Return without saving' : 'Cancel',
    buttonText: interactionId
      ? 'Save and return'
      : `Add ${lowerCase(validatedKind)}`,
    company: get(res.locals, 'company.name'),
    featureFlags: res.locals.features,
  }

  const form = formConfigs[validatedKind](formProperties)
  return form
}

function setDefaultContact (interaction, contact) {
  if (interaction) {
    return interaction.contacts.map(contact => contact.id)
  }
  if (contact) {
    return [get(contact, 'id')]
  }
  return null
}

function setDefaultAdvisers (reqBody = {}) {
  if (!get(reqBody, 'dit_participants')) return
  return {
    dit_participants: reqBody.dit_participants.map(
      ditParticipant => ditParticipant.adviser
    ),
  }
}

function getMergedData (user, locals) {
  const { interaction, contact, requestBody } = locals
  const interactionData = transformInteractionResponseToForm(interaction)
  const interactionDefaults = {
    dit_participants: [user.id],
    date: transformDateStringToDateObject(new Date()),
    contacts: setDefaultContact(interaction, contact),
  }

  return {
    ...interactionDefaults,
    ...interactionData,
    ...requestBody,
    ...setDefaultAdvisers(requestBody),
  }
}

function validateKind (requestParamsKind, existingKind) {
  if (existingKind) {
    return kebabCase(existingKind)
  }

  if (formConfigs.hasOwnProperty(requestParamsKind)) {
    return requestParamsKind
  }
}

async function renderEditPage (req, res, next) {
  try {
    const { interactionId, kind } = req.params
    const mergedInteractionData = getMergedData(req.session.user, res.locals)
    const validatedKind = validateKind(kind, mergedInteractionData.kind)

    if (!validatedKind) {
      throw new Error('Invalid kind')
    }

    const form = await buildForm(req, res, interactionId, validatedKind)
    const errors = get(res.locals, 'form.errors.messages')

    const interactionForm = buildFormWithStateAndErrors(
      form,
      mergedInteractionData,
      errors
    )

    const forEntityName = res.locals.entityName
      ? ` for ${res.locals.entityName}`
      : ''
    const kindName = lowerCase(validatedKind)
    const title = interactionId
      ? `Edit ${kindName}`
      : `Add ${kindName + forEntityName}`

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
