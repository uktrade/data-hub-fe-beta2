const { assign, get } = require('lodash')
const { sentence } = require('case')

const { transformInteractionFormBodyToApiRequest } = require('../transformers')
const { fetchInteraction, saveInteraction } = require('../repos')
const metaDataRepository = require('../../../lib/metadata')
const { getContactsForCompany, getContact } = require('../../contacts/repos')
const { getAdvisers } = require('../../adviser/repos')
const { getActiveEvents } = require('../../events/repos')
const { getDitCompany } = require('../../companies/repos')

async function postDetails (req, res, next) {
  res.locals.requestBody = transformInteractionFormBodyToApiRequest(req.body)

  try {
    const result = await saveInteraction(req.session.token, res.locals.requestBody)

    req.flash('success', `${sentence(req.params.kind)} ${res.locals.interaction ? 'updated' : 'created'}`)

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink + result.id)
    }

    return res.redirect(`/interactions/${result.id}`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: err.error,
        },
      })
      next()
    } else {
      next(err)
    }
  }
}

async function getInteractionDetails (req, res, next, interactionId) {
  try {
    const token = req.session.token
    const interaction = res.locals.interaction = await fetchInteraction(token, interactionId)

    // Get the company associated with the interaction. This can be in the interaction
    // record, or in the case of editing investment interactions it is the company
    // associated with the interaction contact.
    if (interaction.company) {
      res.locals.company = interaction.company
      return next()
    }

    const contactId = get(interaction, 'contact.id')
    if (!contactId) {
      return next(new Error('An interaction must have a company or contact associated with it'))
    }

    const contact = await getContact(token, contactId)
    res.locals.company = await getDitCompany(token, contact.company.id)

    next()
  } catch (err) {
    next(err)
  }
}

async function getInteractionOptions (req, res, next) {
  try {
    const currentAdviser = get(res.locals, 'interaction.dit_advisor.id')
    res.locals.advisers = await getAdvisers({ token: req.session.token, includeDisabled: false, currentAdviser })
    res.locals.contacts = await getContactsForCompany(req.session.token, res.locals.company.id)
    res.locals.services = await metaDataRepository.getServices(req.session.token)

    if (req.params.kind === 'service-delivery') {
      res.locals.events = await getActiveEvents(req.session.token, get(req.params, 'interactionId'))
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getInteractionDetails,
  postDetails,
  getInteractionOptions,
}
