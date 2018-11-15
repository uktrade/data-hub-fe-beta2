const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')
const { search } = require('../search/services')

function saveEvent (token, event) {
  const options = {
    url: `${config.apiRoot}/v3/event`,
    method: 'POST',
    body: event,
  }

  if (event.id) {
    options.url = `${options.url}/${event.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(token, options)
}

function fetchEvent (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v3/event/${id}`)
}

function getEvents (token) {
  return authorisedRequest(token, `${config.apiRoot}/v3/event`)
}

function getAllEvents (token) {
  return authorisedRequest(token, `${config.apiRoot}/v3/event?limit=100000&offset=0`)
}

async function getActiveEvents (token, createdOn) {
  const eventsResponse = await search({
    searchEntity: 'event',
    requestBody: {
      sortby: 'name:asc',
      disabled_on: {
        after: createdOn || (new Date()).toISOString(),
        exists: false,
      },
    },
    token: token,
    limit: 100000,
    isAggregation: false,
  })

  return eventsResponse.results
}

module.exports = {
  saveEvent,
  fetchEvent,
  getEvents,
  getAllEvents,
  getActiveEvents,
}
