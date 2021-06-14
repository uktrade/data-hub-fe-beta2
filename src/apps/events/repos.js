const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')
const { search } = require('../../modules/search/services')

function saveEvent(req, event) {
  const options = {
    url: `${config.apiRoot}/v4/event`,
    method: 'POST',
    body: event,
  }

  if (event.id) {
    options.url = `${options.url}/${event.id}`
    options.method = 'PATCH'
  }

  return authorisedRequest(req, options)
}

function fetchEvent(req, id) {
  return authorisedRequest(req, `${config.apiRoot}/v3/event/${id}`)
}

function getEvents(req) {
  return authorisedRequest(req, `${config.apiRoot}/v3/event`)
}

function getAllEvents(req) {
  return authorisedRequest(
    req,
    `${config.apiRoot}/v3/event?limit=100000&offset=0`
  )
}

async function getActiveEvents(req, createdOn) {
  const eventsResponse = await search({
    req,
    searchEntity: 'event',
    requestBody: {
      sortby: 'name:asc',
      disabled_on: {
        after: createdOn || new Date().toISOString(),
        exists: false,
      },
    },
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
