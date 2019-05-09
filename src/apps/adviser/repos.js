const { get } = require('lodash')
const config = require('../../../config')
const Redis = require('promise-redis')()
const { authorisedRequest } = require('../../lib/authorised-request')

const redisOpts = {
  url: config.redis.url,
}

const client = Redis.createClient(redisOpts)

async function getAdvisers (token) {
  return client.get('advisers')
    .then((result) => {
      console.log('XXXXX XXXXXXXX serving from cache XXXXX XXXXX')
      let results = JSON.parse(result)
      return {
        results,
        count: results.length,
      }
    })
    .catch(() => {
      console.log('YYYYY YYYYY YYYYY fetching')
      return authorisedRequest(token, `${config.apiRoot}/adviser/?limit=100000&offset=0`)
        .then(response => {
          const results = response.results.filter(adviser => get(adviser, 'name', '').trim().length)
          client.set('advisers', JSON.stringify(results), 'EX', 100)
          return {
            results,
            count: results.length,
          }
        })
    })
}

function getAdviser (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/adviser/${id}/`)
}

async function fetchAdviserSearchResults (token, params) {
  const url = `${config.apiRoot}/adviser/?autocomplete=${params.term}`
  const adviserResults = await authorisedRequest(token, { url })
  return adviserResults.results
}

module.exports = {
  getAdvisers,
  getAdviser,
  fetchAdviserSearchResults,
}
