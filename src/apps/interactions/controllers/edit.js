const { assign, get } = require('lodash')

const { getContactsForCompany } = require('../../contacts/repos')
const metadataRepository = require('../../../lib/metadata')
const { getAllAdvisers } = require('../../adviser/repos')
const { createBlankInteractionForCompany, createBlankInteractionForContact } = require('../services/data')
const { saveInteractionForm } = require('../services/form')
const { transformInteractionResponseToForm } = require('../transformers')
const { interactionEditFormConfig } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')

async function renderEditPage (req, res, next) {
  const token = req.session.token
  const defaultDitAdviser = req.session.user

  let returnLink = `/interactions/${get(res.locals, 'interaction.id')}`
  let interaction = res.locals.interaction

  try {
    if (req.query) {
      if (req.query.company) {
        interaction = await createBlankInteractionForCompany(token, defaultDitAdviser, req.query.interaction_type, req.query.company)
        returnLink = `/companies/${req.query.company}/interactions`
      }
      if (req.query.contact) {
        interaction = await createBlankInteractionForContact(token, defaultDitAdviser, req.query.interaction_type, req.query.contact)
        returnLink = `/contacts/${req.query.contact}/interactions`
      }
    }

    const pageTitle = `${interaction.id ? 'Edit' : 'Add'} interaction for ${interaction.company.name}`
    const formData = assign({}, transformInteractionResponseToForm(interaction), req.body)

    const editInteractionForm = buildFormWithStateAndErrors(
      interactionEditFormConfig(
        {
          returnLink,
          contacts: await getContactsForCompany(token, formData.company),
          advisers: await getAllAdvisers(token),
          services: await metadataRepository.getServices(token),
          hiddenFields: {
            interaction_type: formData.interaction_type,
            company: formData.company,
          },
        }
      ),
      formData,
      res.locals.errors,
    )

    res
      .breadcrumb(pageTitle)
      .render('interactions/views/edit', {
        editInteractionForm,
        interactionTypeLabel: interaction.interaction_type.name,
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function postDetails (req, res, next) {
  try {
    const result = await saveInteractionForm(req.session.token, req.body)
    res.redirect(`/interactions/${result.id}`)
  } catch (errors) {
    if (errors.error) {
      res.locals.errors = errors.error.errors || errors.error
      return next()
    }
    next(errors)
  }
}

module.exports = {
  renderEditPage,
  postDetails,
}
