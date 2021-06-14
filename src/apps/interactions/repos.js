const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function fetchInteraction(req, interactionId) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v4/interaction/${interactionId}`
  )
}

function saveInteraction(req, interaction, referralId) {
  const options = {
    url:
      referralId && !interaction.id
        ? `${config.apiRoot}/v4/company-referral/${referralId}/complete`
        : `${config.apiRoot}/v3/interaction`,
    method: 'POST',
    body: interaction,
  }

  if (interaction.id) {
    options.url = `${options.url}/${interaction.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(req, options)
}

function getInteractionsForEntity({ req, entityQuery, page = 1, sortby }) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v3/interaction`,
    qs: {
      ...entityQuery,
      limit,
      offset,
      sortby,
    },
  })
}

function archiveInteraction(req, interactionId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/v3/interaction/${interactionId}/archive`,
    method: 'POST',
  }
  return authorisedRequest(req, options)
}

module.exports = {
  saveInteraction,
  fetchInteraction,
  getInteractionsForEntity,
  archiveInteraction,
}
