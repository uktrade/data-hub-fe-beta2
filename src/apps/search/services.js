const authorisedRequest = require('../../lib/authorised-request')
const config = require('../../../config')
const { buildQueryString } = require('../../lib/url-helpers')

const entities = [
  {
    entity: 'company',
    path: 'companies',
    text: 'Companies',
    noun: 'company',
    count: 0,
  },
  {
    entity: 'contact',
    path: 'contacts',
    text: 'Contacts',
    noun: 'contact',
    count: 0,
  },
  {
    entity: 'event',
    path: 'events',
    text: 'Events',
    noun: 'event',
    count: 0,
  },
  {
    entity: 'interaction',
    path: 'interactions',
    text: 'Interactions',
    noun: 'interaction',
    count: 0,
  },
  {
    entity: 'investment_project',
    path: 'investment-projects',
    text: 'Investment projects',
    noun: 'investment project',
    count: 0,
  },
  {
    entity: 'order',
    path: 'omis',
    text: 'Orders',
    noun: 'order',
    count: 0,
  },
]

function search ({ token, searchTerm = '', searchEntity, requestBody, isAggregation = true, limit = 10, page = 1 }) {
  const searchUrl = `${config.apiRoot}/v3/search`
  let options = {
    url: isAggregation ? searchUrl : `${searchUrl}/${searchEntity}`,
    method: isAggregation ? 'GET' : 'POST',
  }
  requestBody = Object.assign({}, requestBody, {
    term: searchTerm,
    limit,
    offset: (page * limit) - limit,
  })

  if (isAggregation) {
    options.qs = Object.assign(requestBody, {
      entity: searchEntity,
    })
  } else {
    options.body = requestBody
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page
      return result
    })
}

// TODO the search endpoints need aligning see Jira DH-293 for details
function searchCompanies ({ token, searchTerm, isUkBased, page = 1, limit = 10 }) {
  const queryParams = {
    offset: (page * limit) - limit,
    limit,
  }
  const body = {
    original_query: searchTerm,
    uk_based: isUkBased,
  }
  const options = {
    url: `${config.apiRoot}/v3/search/company${buildQueryString(queryParams)}`,
    method: 'POST',
    body,
  }

  return authorisedRequest(token, options)
    .then(result => {
      result.page = page

      return result
    })
}

function searchForeignCompanies (options) {
  const optionsUkBasedFalse = Object.assign({}, options, { isUkBased: false })

  return searchCompanies(optionsUkBasedFalse)
}

function searchLimitedCompanies (options) {
  const optionsUkBasedTrue = Object.assign({}, options, { isUkBased: true })

  return searchCompanies(optionsUkBasedTrue)
    .then((result) => {
      const limitedCompanies = result.results.filter((company) => {
        return company.company_number ||
          (company.business_type && company.business_type.name.toLowerCase().includes('limited company'))
      })

      return {
        page: result.page,
        results: limitedCompanies,
        count: result.count,
      }
    })
}

module.exports = {
  entities,
  search,
  searchCompanies,
  searchLimitedCompanies,
  searchForeignCompanies,
}
