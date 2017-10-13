/* eslint camelcase: 0 */
const { get, merge, pickBy } = require('lodash')

const { transformInteractionResponseToForm } = require('../transformers')
const { transformDateStringToDateObject } = require('../../transformers')
const { interactionEditFormConfig } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')

function renderEditPage (req, res) {
  const interactionData = transformInteractionResponseToForm(res.locals.interaction)
  const interactionDefaults = {
    dit_adviser: req.session.user,
    date: transformDateStringToDateObject(new Date()),
    contact: get(res.locals, 'contact.id'),
  }
  const mergedInteractionData = pickBy(merge({}, interactionDefaults, interactionData, res.locals.requestBody))
  const interactionForm =
    buildFormWithStateAndErrors(
      interactionEditFormConfig(
        {
          returnLink: res.locals.returnLink,
          advisers: get(res.locals, 'advisers.results'),
          contacts: res.locals.contacts,
          services: res.locals.services,
          hiddenFields: {
            id: get(res.locals, 'interaction.id'),
            company: res.locals.company.id,
            investment_project: get(res.locals, 'investmentData.id'),
          },
        }),
      mergedInteractionData,
      get(res.locals, 'form.errors.messages'),
    )

  const forEntityName = res.locals.entityName ? ` for ${res.locals.entityName}` : ''

  res
    .breadcrumb(`${interactionData ? 'Edit' : 'Add'} interaction`)
    .title(`${interactionData ? 'Edit' : 'Add'} interaction${forEntityName}`)
    .render('interactions/views/edit', {
      interactionForm,
    })
}

module.exports = {
  renderEditPage,
}
