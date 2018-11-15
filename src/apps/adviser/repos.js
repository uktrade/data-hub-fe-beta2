const { get, isEmpty } = require('lodash')
const config = require('../../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

function getAdvisers (token) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/?limit=100000&offset=0`)
    .then(response => {
      const results = response.results.filter(adviser => get(adviser, 'name', '').trim().length)

      return {
        results,
        count: results.length,
      }
    })
}

function getAdviser (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/${id}/`)
}

function fetchAdviserSearchResults (token, firstName, lastName) {
  let url = `${config.apiRoot}/adviser/?first_name__icontains=${firstName}`
  if (!isEmpty(lastName)) url += `&last_name__icontains=${lastName}`

  return authorisedRequest(token, { url })
}

function adviserNameSort (a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
  return 0
}

async function adviserSearch (token, term) {
  if (isEmpty(term)) {
    return
  }

  const [firstName, lastName] = term.trim().toLowerCase().split(' ')
  const adviserResults = await fetchAdviserSearchResults(token, firstName, lastName)

  // API only supports contains, so filter out results that don't start with term
  // Then reduce the result down to id and name
  // And finally sort things
  const filteredAdvisers = adviserResults.results
    .filter((adviser) => {
      if (isEmpty(lastName)) {
        return adviser.first_name.toLowerCase().startsWith(firstName)
      }
      return adviser.first_name.toLowerCase().startsWith(firstName) &&
        adviser.last_name.toLowerCase().startsWith(lastName)
    })
    .sort(adviserNameSort)

  return filteredAdvisers
}

module.exports = {
  getAdvisers,
  getAdviser,
  adviserSearch,
}
