const { castArray, sortBy } = require('lodash')

const config = require('../../config')
const Redis = require('promise-redis')()

const { authorisedRequest } = require('../lib/authorised-request')
const { filterDisabledOption } = require('../modules/permissions/filters')
const { transformObjectToOption } = require('../apps/transformers')

const redisOpts = {
  url: config.redis.url,
}

const client = Redis.createClient(redisOpts)

async function tryCache (token, url) {
  return client.get(url)
    .then((redisResponse) => {
      if (!redisResponse) {
        throw new Error('banana')
      }
      let theAnswer = JSON.parse(redisResponse)
      return theAnswer
    })
    .catch(() => {
      return authorisedRequest(token, url)
        .then((httpResponse) => {
          client.set(url, JSON.stringify(httpResponse), 'ex', 100)
          return httpResponse
        })
    })
}

async function getOptions (token, key, { createdOn, currentValue, includeDisabled = false, sorted = true, term, id, queryString = '', context } = {}) {
  if (id) {
    return getOptionsForId(token, key, id)
  }

  if (context) {
    if (queryString.length > 0) {
      queryString = `${queryString}&contexts__has_any=${context}`
    } else {
      queryString = `?contexts__has_any=${context}`
    }
  }

  const url = `${config.apiRoot}/metadata/${key}/${queryString}`
  let options = await tryCache(token, url)

  if (!includeDisabled) {
    options = options.filter(filterDisabledOption({ currentValue, createdOn }))
  }

  if (term) {
    const lowercaseTerm = term.toLowerCase()
    options = options.filter((option) => {
      return option.name.toLowerCase().startsWith(lowercaseTerm)
    })
  }

  if (context) {
    options = options.filter((option) => {
      return !option.contexts || option.contexts.includes(context)
    })
  }

  const mappedOptions = options.map(transformObjectToOption)

  return sorted ? sortBy(mappedOptions, 'label') : mappedOptions
}

async function getOptionsForId (token, key, id) {
  const ids = castArray(id)
  const options = []

  for (let index = 0; index < ids.length; index += 1) {
    const url = key === 'adviser' ? `${config.apiRoot}/adviser/${ids[index]}/` : `${config.apiRoot}/v3/${key}/${ids[index]}`
    const data = await authorisedRequest(token, url)
    options.push({
      value: data.id,
      label: data.name,
    })
  }

  return options
}

module.exports = {
  getOptions,
}
