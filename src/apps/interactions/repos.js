const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function fetchInteraction (token, interactionId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/interaction/${interactionId}`)
}

function saveInteraction (token, interaction) {
  const options = {
    url: `${config.apiRoot}/v3/interaction`,
    method: 'POST',
    body: interaction,
  }

  if (interaction.id) {
    options.url = `${options.url}/${interaction.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

function getInteractionsForEntity ({ token, entityQuery, page = 1, sortby }) {
  const limit = 10
  const offset = limit * (page - 1)
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/interaction`,
    qs: {
      ...entityQuery,
      limit,
      offset,
      sortby,
    },
  })
}

module.exports = {
  saveInteraction,
  fetchInteraction,
  getInteractionsForEntity,
}
